import "server-only";

import { inflateRawSync } from "node:zlib";

export type ContactRow = {
  name: string;
  phone: string;
  row: number;
};

type ImportResult = {
  contacts: ContactRow[];
  rejected: Array<{ row: number; reason: string }>;
};

function decodeXml(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function unzip(buffer: Buffer) {
  const files = new Map<string, Buffer>();
  let end = -1;
  for (let index = buffer.length - 22; index >= Math.max(0, buffer.length - 65557); index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) {
      end = index;
      break;
    }
  }
  if (end === -1) throw new Error("INVALID_XLSX");

  const entries = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  for (let entry = 0; entry < entries; entry += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("INVALID_XLSX");
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");

    if (uncompressedSize > 12 * 1024 * 1024) throw new Error("XLSX_TOO_LARGE");
    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("INVALID_XLSX");
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    if (method === 0) files.set(name, compressed);
    else if (method === 8) files.set(name, inflateRawSync(compressed));
    else throw new Error("UNSUPPORTED_XLSX_COMPRESSION");

    offset += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function columnIndex(reference: string) {
  const letters = reference.match(/[A-Z]+/i)?.[0]?.toUpperCase() || "A";
  let result = 0;
  for (const letter of letters) result = result * 26 + letter.charCodeAt(0) - 64;
  return result - 1;
}

function textNodes(xml: string) {
  return Array.from(xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g))
    .map((match) => decodeXml(match[1]))
    .join("");
}

function xlsxRows(buffer: Buffer) {
  const files = unzip(buffer);
  const sheet = files.get("xl/worksheets/sheet1.xml")?.toString("utf8");
  if (!sheet) throw new Error("EMPTY_XLSX");
  const sharedXml = files.get("xl/sharedStrings.xml")?.toString("utf8") || "";
  const shared = Array.from(sharedXml.matchAll(/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g)).map((match) => textNodes(match[1]));

  return Array.from(sheet.matchAll(/<row(?:\s[^>]*)?>([\s\S]*?)<\/row>/g)).map((rowMatch) => {
    const row: string[] = [];
    for (const cell of rowMatch[1].matchAll(/<c\s([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attributes = cell[1];
      const content = cell[2];
      const reference = attributes.match(/\br="([^"]+)"/)?.[1] || "A1";
      const type = attributes.match(/\bt="([^"]+)"/)?.[1] || "";
      const raw = content.match(/<v>([\s\S]*?)<\/v>/)?.[1] || "";
      let value = decodeXml(raw);
      if (type === "s") value = shared[Number(raw)] || "";
      if (type === "inlineStr") value = textNodes(content);
      row[columnIndex(reference)] = value;
    }
    return row;
  });
}

function csvRows(value: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === '"') {
      if (quoted && value[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && value[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  row.push(cell);
  if (row.some((item) => item.trim())) rows.push(row);
  return rows;
}

function contactsFromRows(rows: string[][]): ImportResult {
  if (!rows.length) return { contacts: [], rejected: [] };
  const header = rows[0].map((value) => String(value || "").trim().toLowerCase());
  const nameHeader = header.findIndex((value) => ["name", "full name", "contact name"].includes(value));
  const phoneHeader = header.findIndex((value) => ["number", "phone", "phone number", "mobile", "mobile number", "contact number"].includes(value));
  const hasHeader = nameHeader >= 0 || phoneHeader >= 0;
  const nameIndex = nameHeader >= 0 ? nameHeader : 0;
  const phoneIndex = phoneHeader >= 0 ? phoneHeader : 1;
  const contacts: ContactRow[] = [];
  const rejected: Array<{ row: number; reason: string }> = [];

  rows.slice(hasHeader ? 1 : 0).forEach((row, index) => {
    const rowNumber = index + (hasHeader ? 2 : 1);
    const name = String(row[nameIndex] || "").trim().slice(0, 80);
    const phone = String(row[phoneIndex] || "").trim().replace(/\.0$/, "");
    const digits = phone.replace(/\D/g, "");
    if (!name && !phone) return;
    if (name.length < 2) rejected.push({ row: rowNumber, reason: "Name is missing or too short" });
    else if (digits.length < 8 || digits.length > 15) rejected.push({ row: rowNumber, reason: "Phone number must contain 8–15 digits" });
    else contacts.push({ name, phone: digits, row: rowNumber });
  });

  return { contacts, rejected };
}

export async function readContactFile(file: File): Promise<ImportResult> {
  if (file.size > 3 * 1024 * 1024) throw new Error("FILE_TOO_LARGE");
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());
  if (name.endsWith(".csv")) return contactsFromRows(csvRows(buffer.toString("utf8").replace(/^\uFEFF/, "")));
  if (name.endsWith(".xlsx")) return contactsFromRows(xlsxRows(buffer));
  throw new Error("UNSUPPORTED_FILE");
}
