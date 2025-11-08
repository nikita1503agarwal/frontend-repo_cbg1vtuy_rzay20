import React from 'react';
import { CreditCard, Receipt } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

export default function Checkout({ inspection, onReset }) {
  if (!inspection) return null;
  const { invoice, invoice_id } = inspection;

  const pay = async () => {
    try {
      const res = await fetch(`${API_BASE}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id }),
      });
      if (!res.ok) throw new Error('Payment failed');
      await res.json();
      alert('Payment successful');
    } catch (e) {
      alert('Payment failed');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Receipt className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-800">Checkout</h2>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white divide-y">
        {invoice.line_items.map((li, i) => (
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
          <p className="font-medium text-slate-800">${invoice.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-slate-600">Taxes (8%)</p>
          <p className="font-medium text-slate-800">${invoice.taxes.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between p-4">
          <p className="text-slate-700 font-medium">Total</p>
          <p className="text-slate-900 font-semibold">${invoice.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button onClick={pay} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors w-full sm:w-auto">
          <CreditCard className="w-4 h-4" />
          Pay now
        </button>
        <button onClick={onReset} className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-5 py-2 rounded-lg transition-colors w-full sm:w-auto">
          Start new inspection
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3">Payment is simulated. Records are stored in the database.</p>
    </div>
  );
}
