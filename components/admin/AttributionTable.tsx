'use client';

interface AttributionRow {
  source: string;
  medium: string;
  count: number;
  value: number;
}

interface AttributionTableProps {
  data: AttributionRow[];
  loading?: boolean;
}

export default function AttributionTable({ data, loading }: AttributionTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-50 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Kaynak / Ortam Attribution</h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Veri yok</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Kaynak</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Ortam</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Donusum</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Deger (TRY)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        row.source === 'google' ? 'bg-blue-500' :
                        row.source === '(direct)' ? 'bg-gray-400' :
                        'bg-amber-500'
                      }`} />
                      <span className="font-medium text-gray-900">{row.source}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{row.medium}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
