'use client';

import { useEffect, useState } from "react";
import type { Feature } from "@/types/feature";

export default function FeatureEditModal({
  open,
  onClose,
  feature,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  feature: Feature;
  onSave: (f: Feature, file?: File | null) => Promise<Feature>;
}) {
  const [data, setData] = useState<Feature>(feature);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(feature.iconUrl || "");
  const [engErr, setEngErr] = useState("");
  const [arErr, setArErr] = useState("");

  useEffect(() => {
    setData(feature);
    setIconFile(null);
    setPreview(feature.iconUrl || "");
    setEngErr("");
    setArErr("");
  }, [feature]);

  if (!open) return null;

  // sanitize
  const sanitizeEn = (v: string) => v.replace(/[^A-Za-z\s]/g, "");
  const sanitizeAr = (v: string) => v.replace(/[^\u0600-\u06FF\s]/g, "");

  // validate
  const validateEnglish = (v: string) => {
    const raw = v.trim();
    if (!raw) return "Required";
    if (!/^[A-Za-z\s]+$/.test(raw)) return "English letters only";
    if (raw.replace(/\s+/g, "").length < 2) return "Minimum 2 letters";
    return "";
  };
  const validateArabic = (v: string) => {
    const raw = v.trim();
    if (!raw) return "مطلوب";
    if (!/^[\u0600-\u06FF\s]+$/.test(raw)) return "أحرف عربية فقط";
    if (raw.replace(/\s+/g, "").length < 2) return "الحد الأدنى حرفان";
    return "";
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const okType =
      /^image\/(png|jpeg|jpg|svg\+xml)$/.test(file.type) ||
      file.name.toLowerCase().endsWith(".svg");
    if (!okType) return alert("Only JPG/PNG/SVG allowed");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
    setIconFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onEnglishChange = (v: string) => {
    const cleaned = sanitizeEn(v);
    setData((d) => ({ ...d, englishTitle: cleaned }));
    setEngErr(validateEnglish(cleaned));
  };
  const onArabicChange = (v: string) => {
    const cleaned = sanitizeAr(v);
    setData((d) => ({ ...d, arabicTitle: cleaned }));
    setArErr(validateArabic(cleaned));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEnglish(data.englishTitle);
    const aErr = validateArabic(data.arabicTitle);
    setEngErr(eErr);
    setArErr(aErr);
    if (eErr || aErr) return;
    await onSave(data, iconFile);
    onClose();
  };

  const hasErrors =
    Boolean(engErr || arErr) ||
    !data.englishTitle.trim() ||
    !data.arabicTitle.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[520px] max-w-[95vw] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Edit feature details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon */}
          <div>
            <label className="block text-sm font-medium">Feature Icon</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border px-3 py-2"
              />
              {preview && (
                <img src={preview} alt="preview" className="h-9 w-9 rounded bg-gray-100 object-contain" />
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">JPG/PNG/SVG — Max 2MB.</p>
          </div>

          {/* English */}
          <div>
            <label className="block text-sm font-medium">Feature Name (English)</label>
            <input
              value={data.englishTitle}
              onChange={(e) => onEnglishChange(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring
                ${engErr ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. Furniture"
              autoComplete="off"
              spellCheck={false}
            />
            {engErr ? (
              <p className="mt-1 text-xs text-red-600">{engErr}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">English letters only. Minimum 2 letters.</p>
            )}
          </div>

          {/* Arabic */}
          <div>
            <label className="block text-sm font-medium">Feature Name (Arabic)</label>
            <input
              dir="rtl"
              value={data.arabicTitle}
              onChange={(e) => onArabicChange(e.target.value)}
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring
                ${arErr ? "border-red-500" : "border-gray-300"}`}
              placeholder="أثاث"
              autoComplete="off"
              spellCheck={false}
            />
            {arErr ? (
              <p className="mt-1 text-xs text-red-600">{arErr}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">أحرف عربية فقط. الحد الأدنى حرفان.</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={data.active ? "Active" : "Inactive"}
              onChange={(e) => setData({ ...data, active: e.target.value === "Active" })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasErrors}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
