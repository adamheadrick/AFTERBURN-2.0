export function MetricCard({
  label,
  value,
  note
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="rounded-md border border-line bg-panel p-3">
      <p className="text-sm font-semibold text-steel">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm font-semibold text-steel">{note}</p>
    </div>
  );
}
