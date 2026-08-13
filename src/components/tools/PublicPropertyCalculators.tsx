"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  KeyRound,
  Percent,
  WalletCards,
} from "lucide-react";

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(Math.round(value), 0));
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  min?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-[#071a2f]">{label}</span>
      <span className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-[#f7f8fa] px-4 transition focus-within:border-[#c9a227] focus-within:bg-white">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(event) =>
            onChange(Math.max(Number(event.target.value) || 0, min))
          }
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#071a2f] outline-none"
        />
        <span className="ml-3 shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {suffix}
        </span>
      </span>
    </label>
  );
}

export default function PublicPropertyCalculators() {
  const [monthlyRent, setMonthlyRent] = useState(40000);
  const [depositMonths, setDepositMonths] = useState(3);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(5000);
  const [brokerageMonths, setBrokerageMonths] = useState(0);

  const [propertyPrice, setPropertyPrice] = useState(120);
  const [yieldRent, setYieldRent] = useState(40000);
  const [yieldMaintenance, setYieldMaintenance] = useState(4000);

  const [salePrice, setSalePrice] = useState(150);
  const [outstandingLoan, setOutstandingLoan] = useState(40);
  const [serviceEstimate, setServiceEstimate] = useState(2);

  const moveIn = useMemo(() => {
    const deposit = monthlyRent * depositMonths;
    const brokerage = monthlyRent * brokerageMonths;
    return {
      deposit,
      brokerage,
      firstMonth: monthlyRent + monthlyMaintenance,
      total: deposit + brokerage + monthlyRent + monthlyMaintenance,
    };
  }, [brokerageMonths, depositMonths, monthlyMaintenance, monthlyRent]);

  const yieldResult = useMemo(() => {
    const value = propertyPrice * 100000;
    const annualRent = yieldRent * 12;
    const annualMaintenance = yieldMaintenance * 12;
    return {
      annualRent,
      annualMaintenance,
      grossYield: value > 0 ? (annualRent / value) * 100 : 0,
      maintenanceAdjustedYield:
        value > 0
          ? (Math.max(annualRent - annualMaintenance, 0) / value) * 100
          : 0,
    };
  }, [propertyPrice, yieldMaintenance, yieldRent]);

  const sellerResult = useMemo(() => {
    const gross = salePrice * 100000;
    const loan = outstandingLoan * 100000;
    const services = serviceEstimate * 100000;
    return {
      gross,
      loan,
      services,
      net: Math.max(gross - loan - services, 0),
    };
  }, [outstandingLoan, salePrice, serviceEstimate]);

  return (
    <section className="mt-20 border-t border-slate-200 pt-18 sm:mt-24 sm:pt-22">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a16]">
          Rent, own and sell
        </p>
        <h2 className="mt-5 text-5xl font-medium leading-tight text-[#071a2f] sm:text-6xl">
          Plan the next property decision.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
          See the cash needed to move into a rental, understand an indicative
          rental yield or estimate what may remain from a resale before tax.
        </p>
      </div>

      <div className="mt-12 grid gap-6 xl:grid-cols-3">
        <article className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(7,26,47,.07)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b08a16]">
                For renters
              </p>
              <h3 className="mt-2 text-3xl font-medium text-[#071a2f]">
                Move-in cost
              </h3>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <NumberField label="Monthly rent" value={monthlyRent} onChange={setMonthlyRent} suffix="rupees" step={1000} />
            <NumberField label="Security deposit" value={depositMonths} onChange={setDepositMonths} suffix="months" step={0.5} />
            <NumberField label="Monthly maintenance" value={monthlyMaintenance} onChange={setMonthlyMaintenance} suffix="rupees" step={500} />
            <NumberField label="Optional brokerage" value={brokerageMonths} onChange={setBrokerageMonths} suffix="months" step={0.5} />
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-[#071a2f] p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              Estimated move-in cash
            </p>
            <p className="mt-3 text-4xl font-semibold">{formatRupees(moveIn.total)}</p>
            <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-white/45">First month + maintenance</dt><dd className="font-semibold">{formatRupees(moveIn.firstMonth)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Refundable deposit</dt><dd className="font-semibold">{formatRupees(moveIn.deposit)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Brokerage entered</dt><dd className="font-semibold">{formatRupees(moveIn.brokerage)}</dd></div>
            </dl>
          </div>
          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Excludes moving, agreement, utility and furnishing costs. Confirm
            whether maintenance is included and whether the deposit is refundable.
          </p>
        </article>

        <article className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(7,26,47,.07)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
              <Percent className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b08a16]">
                For owners
              </p>
              <h3 className="mt-2 text-3xl font-medium text-[#071a2f]">
                Rental yield
              </h3>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <NumberField label="Property value" value={propertyPrice} onChange={setPropertyPrice} suffix="lakh" step={1} />
            <NumberField label="Monthly rent" value={yieldRent} onChange={setYieldRent} suffix="rupees" step={1000} />
            <NumberField label="Owner-paid maintenance" value={yieldMaintenance} onChange={setYieldMaintenance} suffix="rupees" step={500} />
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-[#071a2f] p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              Indicative annual yield
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Gross</p>
                <p className="mt-2 text-3xl font-semibold">{yieldResult.grossYield.toFixed(2)}%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">After maintenance</p>
                <p className="mt-2 text-3xl font-semibold">{yieldResult.maintenanceAdjustedYield.toFixed(2)}%</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-white/45">Annual rent</dt><dd className="font-semibold">{formatRupees(yieldResult.annualRent)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Annual maintenance</dt><dd className="font-semibold">{formatRupees(yieldResult.annualMaintenance)}</dd></div>
            </dl>
          </div>
          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Excludes vacancy, repairs, furnishing, taxes, insurance, finance
            costs and changes in property value. It is not an investment return forecast.
          </p>
        </article>

        <article className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(7,26,47,.07)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#071a2f] text-[#e4c462]">
              <WalletCards className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b08a16]">
                For sellers
              </p>
              <h3 className="mt-2 text-3xl font-medium text-[#071a2f]">
                Net before tax
              </h3>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <NumberField label="Expected sale price" value={salePrice} onChange={setSalePrice} suffix="lakh" step={1} />
            <NumberField label="Outstanding home loan" value={outstandingLoan} onChange={setOutstandingLoan} suffix="lakh" step={1} />
            <NumberField label="Service / settlement estimate" value={serviceEstimate} onChange={setServiceEstimate} suffix="lakh" step={0.25} />
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-[#071a2f] p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4c462]">
              Estimated amount remaining
            </p>
            <p className="mt-3 text-4xl font-semibold">{formatRupees(sellerResult.net)}</p>
            <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-white/45">Expected sale value</dt><dd className="font-semibold">{formatRupees(sellerResult.gross)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Less outstanding loan</dt><dd className="font-semibold">{formatRupees(sellerResult.loan)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Less entered services</dt><dd className="font-semibold">{formatRupees(sellerResult.services)}</dd></div>
            </dl>
          </div>
          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Before capital-gains tax, TDS reconciliation, loan-closure charges,
            society dues and other transaction-specific adjustments. Seek tax
            and legal advice before relying on a sale plan.
          </p>
        </article>
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-950 sm:p-6">
        <Calculator className="mt-0.5 size-5 shrink-0 text-[#9a7410]" />
        <p>
          <strong>Planning estimates only.</strong> These calculators do not
          provide a property valuation, rental or resale quote, legal opinion,
          tax advice, investment recommendation or guarantee. Actual amounts
          depend on the agreement, property, service scope and applicable rules.
        </p>
      </div>
    </section>
  );
}
