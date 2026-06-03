export interface TermsSection {
  id: string;
  title: string;
  content: string | string[];
}

export interface TermsContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  introduction: string;
  sections: TermsSection[];
}

export const termsAndConditionsContent: TermsContent = {
  title: "Terms & Conditions",
  subtitle: "These terms govern all bookings made with Varda Car Rentals for cab and self-drive car rental services in Goa.",
  lastUpdated: "June 2026",
  introduction: "Please read these Terms & Conditions carefully before booking a vehicle with Varda Car Rentals. By confirming a booking or using our rental vehicles (cabs or self-drive cars) in Goa, you agree to be bound by these terms.",
  sections: [
    {
      id: "booking-confirmation",
      title: "1. Booking & Vehicle Availability",
      content: [
        "All bookings are subject to vehicle availability and final confirmation by Varda Car Rentals. A booking is officially confirmed only when we provide confirmation via WhatsApp, phone call, or email.",
        "While we make every effort to provide the exact vehicle model requested, we reserve the right to substitute it with an equivalent or higher category vehicle in case of unforeseen maintenance, delayed returns, or force majeure events."
      ]
    },
    {
      id: "eligibility-requirements",
      title: "2. Self-Drive Eligibility & Documentation",
      content: [
        "To rent a self-drive vehicle, the renter must be at least 21 years of age and hold a valid, clean Indian or International Driving License suitable for the category of vehicle booked.",
        "Renters must present original documents at the time of delivery: (a) Valid Driving License, and (b) Government-approved ID card (Aadhaar Card, Passport, or Voter ID).",
        "A refundable security deposit is required for all self-drive rentals. The deposit amount varies by vehicle class and will be returned within 24–48 hours of vehicle return, subject to damage and fuel checks."
      ]
    },
    {
      id: "pricing-payments",
      title: "3. Rental Rates, Fuel, & Tolls",
      content: [
        "Rental Charges: Daily rates are calculated on a 24-hour basis (from the time of delivery to the time of return). Any delay in returning the vehicle beyond a grace period of 30 minutes may incur additional hourly or full-day charges.",
        "Fuel Policy: Self-drive rentals are provided on a 'Fuel-to-Fuel' or 'Matching-Level' basis. The vehicle must be returned with the same fuel level as it was delivered. No refunds or adjustments will be made for excess fuel left in the tank.",
        "Tolls, Parking, & Fines: All toll fees, parking charges, border entry taxes, and traffic violation fines incurred during the rental period are the sole responsibility of the renter."
      ]
    },
    {
      id: "vehicle-use-restrictions",
      title: "4. Permitted Use & Restrictions",
      content: [
        "The rental vehicle must be driven safely and responsibly in accordance with all local speed limits and traffic regulations in Goa (Maximum speed limits for self-drive cars is 80 km/h or as signed).",
        "Prohibited Uses: The vehicle shall not be used: (a) for racing, off-roading, driving on beaches, or carrying load beyond capacity; (b) by any person under the influence of alcohol, drugs, or illegal substances; (c) for commercial sub-leasing, carrying passengers for hire, or illegal transport of goods.",
        "Geographical Limits: Self-drive cars must not be driven outside the state borders of Goa without prior written permit and authorization from Varda Car Rentals."
      ]
    },
    {
      id: "damage-insurance",
      title: "5. Damage, Accidents, & Theft",
      content: [
        "In the event of an accident, damage, or theft, the renter must notify Varda Car Rentals immediately. Renter must not carry out any unauthorized repairs.",
        "Renter Liability: For minor damages (scratches, dents, tire punctures, windshield damage, interior stains/burns), the renter is liable for the full repair cost up to the security deposit or the insurance deductible limit.",
        "For major accidents or theft, renter liability is subject to terms of our insurance policy, provided the renter has complied with all terms here (e.g. not driving drunk, not driving on beaches, and filing a timely FIR)."
      ]
    },
    {
      id: "cancellations-refunds",
      title: "6. Cancellation & Refund Policy",
      content: [
        "Cancellations made more than 48 hours before the scheduled pickup time are eligible for a full refund.",
        "Cancellations made between 24 and 48 hours of pickup are subject to a cancellation fee equivalent to one day's rental charge.",
        "Cancellations made less than 24 hours before pickup, or no-shows, are non-refundable."
      ]
    },
    {
      id: "limitation-liability",
      title: "7. Limitation of Liability",
      content: "Varda Car Rentals shall not be held liable for any indirect, incidental, or consequential damages, including loss of profit, travel delays, or personal inconvenience, arising from vehicle mechanical breakdown, traffic conditions, weather events, or road blockages."
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: "These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Panaji, Goa."
    }
  ]
};
