import Link from "next/link";

type Action = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "text";
};

type Props = {
  title: string;
  lede: string;
  eyebrow?: string;
  actions?: Action[];
};

export function PageIntro({ title, lede, eyebrow, actions }: Props) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(20,184,166,0.14),transparent_52%),radial-gradient(ellipse_at_90%_20%,rgba(15,118,110,0.08),transparent_45%)]"
      />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-16 md:pt-20 pb-14 md:pb-16">
        {eyebrow && (
          <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#0f766e]">
            {eyebrow}
          </p>
        )}
        <h1 className="marketing-rise marketing-display mt-3 max-w-4xl text-[clamp(2.25rem,4.5vw,3.75rem)] text-gray-950">
          {title}
        </h1>
        <p className="marketing-rise-delay mt-5 max-w-2xl text-[17px] md:text-[18px] leading-relaxed text-gray-600">
          {lede}
        </p>
        {actions && actions.length > 0 && (
          <div className="marketing-rise-delay-2 mt-8 flex flex-wrap gap-3">
            {actions.map((a) => {
              if (a.variant === "secondary") {
                return (
                  <Link key={a.href + a.label} href={a.href} className="marketing-btn-secondary">
                    {a.label}
                  </Link>
                );
              }
              if (a.variant === "text") {
                return (
                  <Link
                    key={a.href + a.label}
                    href={a.href}
                    className="inline-flex items-center h-12 px-2 text-[15px] font-semibold text-gray-700 hover:text-[#0f766e]"
                  >
                    {a.label}
                  </Link>
                );
              }
              return (
                <Link key={a.href + a.label} href={a.href} className="marketing-btn-primary">
                  {a.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
