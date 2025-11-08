import React, { useState } from 'react';
import { Search, Car, User } from 'lucide-react';

const mockCustomers = [
  {
    id: 'c_001',
    name: 'Alex Johnson',
    phone: '+1 555-101-2020',
    email: 'alex.j@example.com',
    vehicles: [
      { vin: '1HGCM82633A004352', plate: 'AJX-4521', make: 'Honda', model: 'Civic', year: 2018, color: 'Blue' },
      { vin: '1FTFW1ET1EKE12345', plate: 'TRK-9087', make: 'Ford', model: 'F-150', year: 2014, color: 'Black' },
    ],
  },
  {
    id: 'c_002',
    name: 'Maria Gomez',
    phone: '+1 555-303-4040',
    email: 'maria.g@example.com',
    vehicles: [
      { vin: 'JH4KA4650MC123456', plate: 'MGM-2277', make: 'Acura', model: 'Legend', year: 1991, color: 'Red' },
    ],
  },
];

export default function VehicleFinder({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const search = (e) => {
    e.preventDefault();
    setError('');

    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setError('Enter a phone, email, VIN or plate to search.');
      return;
    }

    const matches = [];
    mockCustomers.forEach((c) => {
      const customerMatch =
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q);

      const vehicleMatches = c.vehicles.filter(
        (v) =>
          v.vin.toLowerCase().includes(q) ||
          v.plate.toLowerCase().includes(q) ||
          `${v.make} ${v.model}`.toLowerCase().includes(q)
      );

      if (customerMatch || vehicleMatches.length) {
        matches.push({ customer: c, vehicles: vehicleMatches.length ? vehicleMatches : c.vehicles });
      }
    });

    setResults(matches);
    if (!matches.length) setError('No results found. Try a different query.');
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-800">Find Customer & Vehicle</h2>
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
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}

      {!!results.length && (
        <div className="mt-5 grid gap-4">
          {results.map(({ customer, vehicles }) => (
            <div key={customer.id} className="rounded-lg border border-slate-200 p-4 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-800">{customer.name}</p>
                  <p className="text-xs text-slate-500">{customer.phone} • {customer.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {vehicles.map((v) => (
                  <button
                    key={v.vin}
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
