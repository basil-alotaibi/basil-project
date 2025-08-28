'use client';

import { useState } from "react";
import UnitsTable from "./components/UnitsTable";
import FeatureEditModal from "./components/FeatureEditModal";
import type { FeatureRow, Feature } from "@/types/feature";

const INITIAL: FeatureRow[] = [
  { code: "1001", englishTitle: "A/C", arabicTitle: "مُكيّف", status: "Inactive", iconUrl: "" },
  { code: "1002", englishTitle: "Furniture", arabicTitle: "أثاث", status: "Inactive", iconUrl: "" },
];

export default function HomePage() {
  const [rows, setRows] = useState<FeatureRow[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FeatureRow | null>(null);

  const onEdit = (row: FeatureRow) => {
    setSelected(row);
    setOpen(true);
  };

  
  const onSave = async (f: Feature, file?: File | null) => {
    const iconUrl = file ? URL.createObjectURL(file) : f.iconUrl;
    setRows(prev =>
      prev.map(r =>
        r.code === f.id
          ? {
              ...r,
              englishTitle: f.englishTitle,
              arabicTitle: f.arabicTitle,
              status: f.active ? "Active" : "Inactive",
              iconUrl: iconUrl || r.iconUrl,
            }
          : r
      )
    );
    return { ...f, iconUrl };
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <section className="mx-auto max-w-[1160px] px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Features</h1>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Feature
          </button>
        </div>

        <UnitsTable rows={rows} onEdit={onEdit} />
      </section>

      {selected && (
        <FeatureEditModal
          open={open}
          onClose={() => setOpen(false)}
          feature={{
            id: selected.code,
            englishTitle: selected.englishTitle ?? "",
            arabicTitle: selected.arabicTitle ?? "",
            iconUrl: selected.iconUrl,
            active: selected.status === "Active",
          }}
          onSave={onSave}
        />
      )}
    </main>
  );
}
