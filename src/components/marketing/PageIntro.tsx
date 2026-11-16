type Props = {
  title: string;
  lede: string;
  eyebrow?: string;
};

export function PageIntro({ title, lede, eyebrow }: Props) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 pt-16 md:pt-20 pb-12 md:pb-16">
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
      </div>
    </section>
  );
}
