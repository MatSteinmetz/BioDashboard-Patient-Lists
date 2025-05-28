import React, { useState } from 'react';

const columns = [
  { key: 'mrn', label: 'MRN' },
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Current Location' },
  { key: 'attending', label: 'Attending' },
  { key: 'los', label: 'LOS' },
  { key: 'rn', label: 'RN' },
  { key: 'iso', label: 'ISO' },
  { key: 'fallRisk', label: 'Fall Risk' },
  { key: 'tele', label: 'Tele' },
  { key: 'bioNotif', label: 'BioButton Notifications' },
  { key: 'bioActivity', label: 'BioButton Activity' },
  { key: 'h2h', label: 'Enrolled in H2H?' },
  { key: 'discharge', label: 'Discharge Readiness (operational)' },
  { key: 'sleep', label: 'Sleep' },
  { key: 'activity', label: 'Real Time Activity' },
];

const randomNames = [
  'Ava Smith', 'Liam Johnson', 'Olivia Brown', 'Noah Jones', 'Emma Garcia', 'Mason Lee', 'Sophia Martinez', 'Lucas Davis', 'Isabella Wilson', 'Ethan Anderson',
  'Mia Thomas', 'Logan Taylor', 'Charlotte Moore', 'Elijah Martin', 'Amelia White', 'James Harris', 'Harper Clark', 'Benjamin Lewis', 'Evelyn Young', 'Henry Hall',
  'Abigail King', 'Alexander Wright', 'Emily Scott', 'Sebastian Green', 'Elizabeth Adams', 'Jack Baker', 'Sofia Nelson', 'Daniel Carter', 'Ella Perez', 'Matthew Roberts'
];
const randomAttending = [
  'Dr. Carter', 'Dr. Evans', 'Dr. Murphy', 'Dr. Patel', 'Dr. Kim', 'Dr. Rivera', 'Dr. Brooks', 'Dr. Morgan', 'Dr. Reed', 'Dr. Bailey',
  'Dr. Cooper', 'Dr. Bell', 'Dr. Ward', 'Dr. Cox', 'Dr. Diaz', 'Dr. Gray', 'Dr. Hayes', 'Dr. Price', 'Dr. Ross', 'Dr. Wood',
  'Dr. Kelly', 'Dr. Perry', 'Dr. Powell', 'Dr. Russell', 'Dr. Simmons', 'Dr. Stewart', 'Dr. Turner', 'Dr. Watson', 'Dr. West', 'Dr. Wheeler'
];
const randomRN = [
  'Nurse Allen', 'Nurse Barnes', 'Nurse Boyd', 'Nurse Burke', 'Nurse Cain', 'Nurse Cross', 'Nurse Dean', 'Nurse Fox', 'Nurse Grant', 'Nurse Hale',
  'Nurse Hunt', 'Nurse Lane', 'Nurse Lowe', 'Nurse Marsh', 'Nurse Moss', 'Nurse Nash', 'Nurse Page', 'Nurse Parks', 'Nurse Pratt', 'Nurse Ray',
  'Nurse Rice', 'Nurse Rowe', 'Nurse Shaw', 'Nurse Tate', 'Nurse Todd', 'Nurse Tyler', 'Nurse Wade', 'Nurse Ware', 'Nurse Wise', 'Nurse York'
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const patientData = Array.from({ length: 30 }, (_, i) => ({
  mrn: 100000 + i,
  name: getRandom(randomNames),
  location: `Room ${200 + i}`,
  attending: getRandom(randomAttending),
  los: `${Math.floor(Math.random() * 15) + 1}d`,
  rn: getRandom(randomRN),
  iso: Math.random() > 0.8 ? 'Yes' : 'No',
  fallRisk: Math.random() > 0.7 ? 'High' : 'Low',
  tele: Math.random() > 0.5 ? 'Yes' : 'No',
  bioNotif: Math.random() > 0.5 ? 'Active' : 'None',
  bioActivity: Math.random() > 0.5 ? 'Normal' : 'Alert',
  h2h: Math.random() > 0.5 ? 'Yes' : 'No',
  discharge: Math.random() > 0.5 ? 'Ready' : 'Not Ready',
  sleep: `${Math.floor(Math.random() * 8) + 1}h`,
  activity: Math.random() > 0.5 ? 'Active' : 'Resting',
}));

export default function App() {
  const [layout, setLayout] = useState('default');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-700 bg-slate-900/80">
        <h1 className="text-2xl font-bold tracking-wide">Patient Dashboard</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search patients..."
            className="rounded bg-slate-800 px-3 py-1 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={() => setLayout(layout === 'default' ? 'alt' : 'default')}
          >
            Toggle Layout
          </button>
        </div>
      </header>
      <main className="p-8 overflow-x-auto">
        <div className="rounded-lg shadow-lg bg-slate-800/80">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 bg-slate-800"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patientData.map((row, idx) => (
                <tr
                  key={row.mrn}
                  className={
                    'hover:bg-slate-700/60 transition ' +
                    (idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/60')
                  }
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 