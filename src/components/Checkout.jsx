import React, { useMemo } from 'react';
import { CreditCard, Receipt, DollarSign } from 'lucide-react';

export default function Checkout({ inspection, onReset }) {
  const lineItems = useMemo(() => {
    if (!inspection) return [];
    const items = [];

    const counts = { attention: 0, fail: 0 };
    Object.values(inspection.checks).forEach((section) => {
      Object.values(section).forEach((v) => {
        if (v === 'attention') counts.attention += 1;
        if (v === 'fail') counts.fail += 1;
      });
    });

    if (counts.attention) items.push({ name: 'Preventive maintenance items', qty: counts.attention, price: 25 });
    if (counts.fail) items.push({ name: 'Critical repair items', qty: counts.fail, price: 60 });
    items.push({ name: 'Base inspection fee', qty: 1, price: 49 });

    return items;
  }, [inspection]);

  const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.price, 0);
  const taxes = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Receipt className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-800">Checkout</h2>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white divide-y">
        {lineItems.map((li, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-slate-800">{li.name}</p>
              <p className="text-xs text-slate-500">Qty {li.qty} × ${li.price.toFixed(2)}</p>
            </div>
            <p className="font-semibold text-slate-800">${(li.qty * li.price).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex items-center justify-between p-4">
          <p className="text-slate-600">Subtotal</p>
          <p className="font-medium text-slate-800">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-slate-600">Taxes (8%)</p>
          <p className="font-medium text-slate-800">${taxes.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-slate-700 font-medium">Total</p>
          <p className="text-slate-900 font-semibold">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors w-full sm:w-auto">
          <CreditCard className="w-4 h-4" />
          Pay now
        </button>
        <button onClick={onReset} className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-5 py-2 rounded-lg transition-colors w-full sm:w-auto">
          Start new inspection
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3">Payment is simulated for this demo. No real transactions occur.</p>
    </div>
  );
}
