export function PageTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 border-b border-line pb-4">
      <p className="text-xs font-semibold text-steel">{eyebrow}</p>
      <h1 className="mt-1 text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm font-normal leading-6 text-steel">{description}</p>
    </div>
  );
}
