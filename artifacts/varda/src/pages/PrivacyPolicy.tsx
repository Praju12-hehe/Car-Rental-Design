import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { privacyPolicyContent } from "../content/privacy-policy";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10 lg:px-16">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <h1 className="text-4xl font-serif md:text-5xl">{privacyPolicyContent.title}</h1>
        <div className="mt-2 text-xs uppercase tracking-wider text-white/40">Last Updated: {privacyPolicyContent.lastUpdated}</div>
        <p className="mt-4 max-w-2xl text-white/65">{privacyPolicyContent.subtitle}</p>
        <p className="mt-6 text-sm leading-relaxed text-white/75 italic">{privacyPolicyContent.introduction}</p>

        <article className="mt-10 space-y-8 text-sm leading-7 text-white/75">
          {privacyPolicyContent.sections.map((section) => (
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

