import StatusBadge from "./StatusBadge";
import type { FeatureRow } from "@/types/feature";

export default function UnitsTable({
  rows,
  onEdit,
}: {
  rows: FeatureRow[];
  onEdit: (r: FeatureRow) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {["UID", "Feature", "Status", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr key={r.code} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-800">{r.code}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {r.iconUrl ? (
                    <img src={r.iconUrl} className="h-6 w-6 rounded bg-gray-100 object-contain" />
                  ) : (
                    <div className="h-6 w-6 rounded bg-gray-100" />
                  )}
                  <div className="leading-tight">
                    <div className="font-medium text-gray-900">{r.englishTitle}</div>
                    <div className="text-xs text-gray-500">{r.arabicTitle}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(r)}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
