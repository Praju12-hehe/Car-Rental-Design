import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10 lg:px-16">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Back to home
        </a>

        <h1 className="text-4xl font-serif md:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 max-w-2xl text-white/65">These terms govern all bookings made with Varda Car Rentals for cab and self-drive car rental services in Goa.</p>

        <article className="mt-10 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Booking confirmation</h2>
            <p>All bookings are subject to vehicle availability and confirmation by Varda Car Rentals. A booking is considered confirmed once we confirm on WhatsApp, call, or email.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">2. Charges & payments</h2>
            <p>Rental charges, fuel, tolls, parking, and other applicable fees are as per the agreed quotation. Any extra usage beyond the agreed package may be charged separately.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">3. Driver and vehicle use</h2>
            <p>The driver or vehicle must be used responsibly and only for lawful travel. The renter is responsible for any damage, fines, or penalties caused by misuse or negligence.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">4. Cancellation policy</h2>
            <p>Cancellation terms may vary based on the booking type. Please confirm the cancellation policy at the time of booking.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">5. Liability</h2>
            <p>Varda Car Rentals is not liable for delays, losses, or inconvenience caused by traffic, weather, road conditions, or unforeseen events beyond our control.</p>
          </section>
        </article>
      </section>
    </main>
  );
}
