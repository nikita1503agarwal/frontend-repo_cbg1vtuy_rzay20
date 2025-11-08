import React, { useState } from 'react';
import VehicleFinder from './components/VehicleFinder';
import InspectionForm from './components/InspectionForm';
import SummaryCard from './components/SummaryCard';
import Checkout from './components/Checkout';
import { Settings } from 'lucide-react';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [inspection, setInspection] = useState(null);

  const reset = () => {
    setSelected(null);
    setInspection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">CI</div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Car Inspection & Customer Finder</h1>
              <p className="text-xs text-slate-500">Search customers, run inspections, and checkout</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!selected && (
            <VehicleFinder onSelect={setSelected} />
          )}

          {selected && !inspection && (
            <InspectionForm selected={selected} onComplete={setInspection} />
          )}

          {selected && inspection && (
            <Checkout inspection={inspection} onReset={reset} />
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <SummaryCard selected={selected} inspection={inspection} />

          <div className="rounded-xl border border-slate-200 p-6 bg-white/70 backdrop-blur">
            <h3 className="text-slate-800 font-semibold mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-sm">
              <li>Search by customer info, VIN, or license plate</li>
              <li>Select the vehicle and complete the inspection</li>
              <li>Review charges and finalize checkout</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 text-center text-xs text-slate-500">
        Built for a smooth service lane experience.
      </footer>
    </div>
  );
}
