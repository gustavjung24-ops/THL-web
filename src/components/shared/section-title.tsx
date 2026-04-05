type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description ? <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p> : null}
    </div>
  );
}
