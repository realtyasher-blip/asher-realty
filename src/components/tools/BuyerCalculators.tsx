"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, IndianRupee, Landmark, WalletCards } from "lucide-react";

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export default function BuyerCalculators() {
  const [propertyValue, setPropertyValue] = useState(200);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const value = propertyValue * 100000;
    const upfront = value * (downPayment / 100);
    const loan = Math.max(value - upfront, 0);
    const months = tenure * 12;
    const monthlyRate = interestRate / 12 / 100;
    const emi =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
    const totalPaid = emi * months;
    const registrationEstimate = value * 0.066;

    return {
      value,
      upfront,
      loan,
      emi,
      interest: totalPaid - loan,
      registrationEstimate,
      initialCash: upfront + registrationEstimate,
    };
  }, [downPayment, interestRate, propertyValue, tenure]);

  const projectPriceBand =
    propertyValue <= 200
      ? "Up to ₹2 Cr"
      : propertyValue <= 300
        ? "₹2–3 Cr"
        : "₹3 Cr+";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(7,26,47,.08)] sm:p-9">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#071a2f]">
            <Calculator className="size-5 text-[#e4c462]" />
          </span>
          <div>
            <h2 className="text-3xl font-medium text-[#071a2f]">EMI planner</h2>
            <p className="mt-1 text-sm text-slate-500">Adjust the assumptions to match your plan.</p>
          </div>
        </div>

        <div className="mt-9 space-y-8">
          {[
            {
              label: "Property value",
              value: propertyValue,
              setter: setPropertyValue,
              min: 50,
              max: 1000,
              step: 5,
              display: `₹${propertyValue} lakh`,
            },
            {
              label: "Down payment",
              value: downPayment,
              setter: setDownPayment,
              min: 10,
              max: 60,
              step: 5,
              display: `${downPayment}%`,
            },
            {
              label: "Interest rate",
              value: interestRate,
              setter: setInterestRate,
              min: 6,
              max: 14,
              step: 0.1,
              display: `${interestRate.toFixed(1)}%`,
            },
            {
              label: "Loan tenure",
              value: tenure,
              setter: setTenure,
              min: 5,
              max: 30,
              step: 1,
              display: `${tenure} years`,
            },
          ].map(({ label, value, setter, min, max, step, display }) => (
            <label key={label} className="block">
              <span className="flex items-center justify-between text-sm font-semibold text-[#071a2f]">
                {label}
                <span className="rounded-full bg-[#f4f5f7] px-3 py-1.5 text-xs text-[#b08a16]">
                  {display}
                </span>
              </span>
              <input
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(event) => setter(Number(event.target.value))}
                className="mt-4 w-full accent-[#c9a227]"
              />
              <span className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>{min}</span>
                <span>{max}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-[#071a2f] p-6 text-white shadow-[0_24px_80px_rgba(7,26,47,.18)] sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4c462]">
          Estimated monthly EMI
        </p>
        <p className="mt-4 text-5xl font-semibold">{formatRupees(result.emi)}</p>
        <p className="mt-2 text-sm text-white/45">per month for {tenure} years</p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[
            { icon: Landmark, label: "Loan amount", value: result.loan },
            { icon: WalletCards, label: "Down payment", value: result.upfront },
            { icon: IndianRupee, label: "Estimated interest", value: result.interest },
            {
              icon: Calculator,
              label: "Registration estimate",
              value: result.registrationEstimate,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Icon className="size-5 text-[#e4c462]" />
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                {label}
              </p>
              <p className="mt-2 font-semibold">{formatRupees(value)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e4c462]">
            Approximate initial cash
          </p>
          <p className="mt-2 text-2xl font-semibold">{formatRupees(result.initialCash)}</p>
          <p className="mt-3 text-xs leading-5 text-white/45">
            Down payment plus a broad registration and statutory-cost estimate.
            Actual costs vary by property, agreement structure and prevailing rules.
          </p>
        </div>

        <Link
          href={`/projects?price=${encodeURIComponent(projectPriceBand)}`}
          className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#c9a227] px-6 text-sm font-bold text-[#071a2f] transition hover:bg-[#e4c462]"
        >
          Browse homes in this budget
        </Link>
        <a
          href={`https://wa.me/919019697170?text=${encodeURIComponent(
            `Hi Asher Realty, I am considering a property around ₹${propertyValue} lakh. Please help me shortlist suitable Bengaluru projects and explain the complete buying cost.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-11 w-full items-center justify-center text-xs font-bold text-white/55 transition hover:text-white"
        >
          Ask an advisor about these numbers
        </a>
      </div>
    </div>
  );
}
