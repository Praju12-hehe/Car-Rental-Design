import { ArrowLeft } from "lucide-react";
import { termsAndConditionsContent } from "../content/terms-and-conditions";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10 lg:px-16">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Back to home
        </a>

        <h1 className="text-4xl font-serif md:text-5xl">{termsAndConditionsContent.title}</h1>
        <div className="mt-2 text-xs uppercase tracking-wider text-white/40">Last Updated: {termsAndConditionsContent.lastUpdated}</div>
        <p className="mt-4 max-w-2xl text-white/65">{termsAndConditionsContent.subtitle}</p>
        <p className="mt-6 text-sm leading-relaxed text-white/75 italic">{termsAndConditionsContent.introduction}</p>

        <article className="mt-10 space-y-8 text-sm leading-7 text-white/75">
          {termsAndConditionsContent.sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              {Array.isArray(section.content) ? (
                section.content.map((p, index) => (
                  <p key={index} className={index === 0 && p.endsWith(":") ? "font-medium text-white/90" : ""}>
                    {p}
                  </p>
                ))
              ) : (
                <p>{section.content}</p>
              )}
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}

