import React, { useState } from 'react';
import { Search, Car, User, Database } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

export default function VehicleFinder({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const search = async (e) => {
    e?.preventDefault?.();
    setError('');

    const q = query.trim();
    if (!q) {
      setResults([]);
      setError('Enter a phone, email, VIN or plate to search.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results?.length) setError('No results found. Try a different query.');
    } catch (err) {
      setError('Could not search. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const seedDemo = async () => {
    try {
      setSeeding(true);
      await fetch(`${API_BASE}/seed`, { method: 'POST' });
      // Re-run the search to show new data if a query exists
      if (query.trim()) await search();
    } catch (e) {
      setError('Seeding failed.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-800">Find Customer & Vehicle</h2>
        </div>
        <button onClick={seedDemo} disabled={seeding} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <Database className="w-3.5 h-3.5" />
          Seed demo data
        </button>
      </div>

      <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by phone, email, name, VIN, or plate"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}

      {!!results.length && (
        <div className="mt-5 grid gap-4">
          {results.map(({ customer, vehicles }) => (
            <div key={customer?._id || Math.random()} className="rounded-lg border border-slate-200 p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-800">{customer?.name}</p>
                  <p className="text-xs text-slate-500">{customer?.phone} • {customer?.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {vehicles.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => onSelect({ customer, vehicle: v })}
                    className="w-full text-left rounded-md border border-slate-200 hover:border-blue-400 p-3 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-700">
                      <Car className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{v.year} {v.make} {v.model}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">VIN: {v.vin}</p>
                    <p className="text-xs text-slate-500">Plate: {v.plate} • {v.color}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
