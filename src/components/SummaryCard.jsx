import React from 'react';
import { IdCard, Car, User, CalendarClock } from 'lucide-react';

export default function SummaryCard({ selected, inspection }) {
  if (!selected) return null;
  const { customer, vehicle } = selected;
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Order</h3>
          <p className="text-slate-300 text-sm">{new Date().toLocaleString()}</p>
        </div>
        <IdCard className="w-6 h-6 text-slate-300" />
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-200">
            <User className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Customer</span>
          </div>
          <p className="mt-2 font-medium">{customer?.name}</p>
          <p className="text-sm text-slate-300">{customer?.phone}</p>
          <p className="text-sm text-slate-300">{customer?.email}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Car className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Vehicle</span>
          </div>
          <p className="mt-2 font-medium">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
          <p className="text-sm text-slate-300">VIN: {vehicle?.vin}</p>
          <p className="text-sm text-slate-300">Plate: {vehicle?.plate} • {vehicle?.color}</p>
        </div>
      </div>

      {inspection && (
        <div className="mt-4 bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-200">
            <CalendarClock className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Status</span>
          </div>
          <p className="mt-2 font-medium">Inspection saved</p>
          <p className="text-sm text-slate-300">{new Date(inspection.createdAt || Date.now()).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
