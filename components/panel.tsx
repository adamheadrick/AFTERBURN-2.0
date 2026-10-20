export function Panel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-line bg-panel ${className}`}>{children}</section>;
}

export function PanelHeader({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold text-steel">{eyebrow}</p> : null}
        <h2 className="text-base font-semibold text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      {children}
    </label>
  );
}

export const inputStyles =
  "min-h-11 rounded-lg border border-line bg-night px-3 py-2 text-sm font-normal text-ink placeholder:font-normal placeholder:text-steel/70 outline-none transition focus:border-flare/60 focus:ring-1 focus:ring-flare/20";
