export interface PolicySection {
  id: string;
  title: string;
  content: string | string[];
}

export interface ContentData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  introduction: string;
  sections: PolicySection[];
}

export const privacyPolicyContent: ContentData = {
  title: "Privacy Policy",
  subtitle: "This Privacy Policy explains how Varda Car Rentals collects, uses, and protects the personal information you share when you book a cab or self-drive car in Goa.",
  lastUpdated: "June 2026",
  introduction: "At Varda Car Rentals, we are committed to safeguarding your privacy. This policy outlines our practices regarding the collection, use, and disclosure of your personal data when you use our website, mobile application, or book vehicles directly with us.",
  sections: [
    {
      id: "information-collection",
      title: "1. Information We Collect",
      content: [
        "We collect personal information to provide and improve our services. This includes:",
        "Personal Identification: Name, phone number, email address, physical address, and government-issued identification (such as driver's license, Aadhaar card, or passport) required for rental validation.",
        "Booking Details: Pickup and drop locations, flight details (for airport transfers), booking dates, times, and vehicle preferences.",
        "Communication Data: Text messages, WhatsApp chats, and call records when you correspond with our customer support or booking coordinators.",
        "Usage Data: Technical information about how you interact with our website, including IP address, browser type, and page access statistics."
      ]
    },
    {
      id: "information-usage",
      title: "2. How We Use Your Information",
      content: [
        "We use the collected information for various business purposes, including:",
        "Processing and confirming bookings for cabs and self-drive cars.",
        "Communicating with you regarding booking status, vehicle delivery, and pickup logistics via WhatsApp, phone call, or email.",
        "Verifying identity and driver eligibility to ensure road safety and compliance with local transport regulations in Goa.",
        "Processing rental payments, handling security deposits, and processing refunds.",
        "Improving our fleet, customer service experience, and optimizing website performance.",
        "Responding to emergency road situations or legal inquiries from law enforcement authorities."
      ]
    },
    {
      id: "data-sharing",
      title: "3. Sharing & Disclosure of Data",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. We share data only in the following limited circumstances:",
        "Service Providers: With trusted operators, drivers, and partners who assist us in vehicle delivery, maintenance, or roadside assistance.",
        "Legal Compliance: When required by Indian law, transport authority regulations, or court order to cooperate with law enforcement and protect our rights.",
        "Safety & Security: To prevent fraud, verify driver history, or in the event of traffic violations, accidents, or damage to property."
      ]
    },
    {
      id: "data-security",
      title: "4. Data Security & Retention",
      content: [
        "We implement appropriate technical and organizational measures to secure your personal data against unauthorized access, alteration, or destruction.",
        "However, please note that no method of transmission over the internet or electronic storage is 100% secure.",
        "We retain your personal identification and booking history only as long as necessary to fulfill the purposes outlined in this policy, satisfy legal/tax/accounting requirements, or resolve disputes."
      ]
    },
    {
      id: "user-rights",
      title: "5. Your Rights & Choices",
      content: [
        "You have the following rights regarding your personal information:",
        "Access & Rectification: You may request details of the personal data we hold about you or request corrections to inaccurate information.",
        "Data Deletion: You can request the removal of your personal information from our active databases, subject to outstanding dues, ongoing rentals, or legal retention mandates.",
        "Marketing Opt-Out: You can opt out of promotional communications at any time by replying to our messages or contacting support."
      ]
    },
    {
      id: "policy-updates",
      title: "6. Updates to This Policy",
      content: "We may update this Privacy Policy from time to time. The updated version will be indicated by the 'Last Updated' date at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your information."
    }
  ]
};
