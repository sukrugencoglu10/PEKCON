'use client';

interface DateRangeSelectorProps {
  selected: string;
  onChange: (range: string) => void;
}

const RANGES = [
  { key: '7d', label: '7 Gun' },
  { key: '30d', label: '30 Gun' },
  { key: '90d', label: '90 Gun' },
];

export default function DateRangeSelector({ selected, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {RANGES.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selected === r.key
              ? 'bg-white text-[#0069b4] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
