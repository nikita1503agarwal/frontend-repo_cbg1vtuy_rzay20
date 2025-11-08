import React, { useState } from 'react';
import { ClipboardList, Camera, CheckCircle2, AlertTriangle } from 'lucide-react';

const sections = [
  {
    key: 'exterior',
    label: 'Exterior',
    items: ['Body panels', 'Lights', 'Mirrors', 'Glass', 'Wipers'],
  },
  {
    key: 'tires_brakes',
    label: 'Tires & Brakes',
    items: ['Tire tread', 'Tire pressure', 'Brake pads', 'Rotors', 'Brake fluid'],
  },
  {
    key: 'engine',
    label: 'Engine Bay',
    items: ['Oil level', 'Coolant', 'Belts', 'Battery', 'Hoses & leaks'],
  },
  {
    key: 'interior',
    label: 'Interior',
    items: ['Seatbelts', 'Airbags light', 'HVAC', 'Horn', 'Dashboard lights'],
  },
];

const API_BASE = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

export default function InspectionForm({ selected, onComplete }) {
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [checks, setChecks] = useState(() => {
    const init = {};
    sections.forEach((s) => {
      init[s.key] = s.items.reduce((acc, item) => ({ ...acc, [item]: 'ok' }), {});
    });
    return init;
  });

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files || []);
    const preview = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...preview]);
  };

  const setItem = (sectionKey, item, value) => {
    setChecks((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [item]: value },
    }));
  };

  const complete = async () => {
    setError('');
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selected.customer._id,
          vehicle_id: selected.vehicle._id,
          checks,
          notes,
          photos: photos.map((p) => p.name),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      onComplete({ ...data, createdAt: new Date().toISOString(), selected });
    } catch (e) {
      setError('Could not save inspection. Ensure backend/database is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-800">Vehicle Inspection</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.key} className="rounded-lg border border-slate-200 p-4 bg-white">
            <p className="font-medium text-slate-800 mb-3">{section.label}</p>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item} className="flex items-center justify-between gap-3">
                  <span className="text-slate-700">{item}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setItem(section.key, item, 'ok')}
                      className={`px-2 py-1 rounded-md text-sm border ${checks[section.key][item] === 'ok' ? 'bg-green-50 text-green-700 border-green-300' : 'border-slate-200 text-slate-600'}`}
                    >OK</button>
                    <button
                      onClick={() => setItem(section.key, item, 'attention')}
                      className={`px-2 py-1 rounded-md text-sm border ${checks[section.key][item] === 'attention' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'border-slate-200 text-slate-600'}`}
                    >Attention</button>
                    <button
                      onClick={() => setItem(section.key, item, 'fail')}
                      className={`px-2 py-1 rounded-md text-sm border ${checks[section.key][item] === 'fail' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'border-slate-200 text-slate-600'}`}
                    >Fail</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 p-4 bg-white">
          <p className="font-medium text-slate-800 mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add overall observations or recommendations"
          />
        </div>
        <div className="rounded-lg border border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-slate-800">Photos</p>
            <label className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 cursor-pointer">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handlePhoto} className="hidden" />
            </label>
          </div>
          {!!photos.length ? (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <img key={i} src={p.url} alt={p.name} className="w-full h-24 object-cover rounded-md border" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No photos added yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={complete}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Inspection'}
        </button>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Photos are listed by name only in this demo.</span>
        </div>
      </div>
    </div>
  );
}
