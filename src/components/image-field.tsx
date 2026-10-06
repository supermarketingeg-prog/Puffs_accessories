import { useState } from "react";
import { uploadImage } from "@/lib/api";
import { fileToDataUrl } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";

export function ImageField({
  label,
  value,
  onChange,
  folder = "products",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "products" | "banners" | "settings";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <img src={value} alt="" className="h-36 w-full rounded-[var(--radius-md)] object-cover ring-1 ring-border" />
      ) : null}
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            const dataUrl = await fileToDataUrl(file);
            const uploaded = await uploadImage({ data: { dataUrl, folder } });
            onChange(uploaded.url);
          } catch (err) {
            setError(err instanceof Error ? err.message : "تعذر رفع الصورة");
          } finally {
            setBusy(false);
          }
        }}
      />
      <Input
        placeholder="أو الصقي رابط صورة"
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
      {busy ? <p className="text-xs text-muted">جاري تجهيز الصورة…</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
