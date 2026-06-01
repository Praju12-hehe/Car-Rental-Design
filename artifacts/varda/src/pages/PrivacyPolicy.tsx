import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10 lg:px-16">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Back to home
        </a>

        <h1 className="text-4xl font-serif md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 max-w-2xl text-white/65">This Privacy Policy explains how Varda Car Rentals collects, uses, and protects the personal information you share when you book a cab or self-drive car in Goa.</p>

        <article className="mt-10 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Information we collect</h2>
            <p>We may collect your name, phone number, email address, pickup and drop locations, travel dates, and booking preferences when you contact us or fill out our booking form.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. How we use it</h2>
            <p>We use your information to confirm bookings, communicate on WhatsApp or phone, arrange vehicle delivery or pickup, and improve our service experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Sharing of data</h2>
            <p>We do not sell your personal information. We may share it only with trusted service providers needed to complete the booking or with legal authorities when required by law.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Data security</h2>
            <p>We take reasonable measures to protect your information but cannot guarantee complete security over the internet.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">5. Your rights</h2>
            <p>You may contact us to request access, correction, or deletion of your personal information, subject to applicable law.</p>
          </section>
        </article>
      </section>
    </main>
  );
}
