import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import { MapPin, X, Menu, ArrowUpRight, ChevronDown, Users, Fuel, Settings2, ExternalLink, Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ─── DATA ────────────────────────────────────────────────────────────────────

type CarPricing = { type: string; price: number };

type CarItem = {
  id: string;
  name: string;
  category: "Budget" | "SUV" | "Premium" | "Luxury";
  image: string;
  pricing: CarPricing[];
  specs: { seats: number; fuel: string; transmission: string };
  tagline: string;
};

const carsData: CarItem[] = [
  // ── BUDGET ──────────────────────────────────────────────────────────────────
  {
    id: "swift", name: "Swift", category: "Budget",
    image: "/cars/swift.png",
    pricing: [{ type: "Manual", price: 1200 }, { type: "Auto", price: 1600 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Manual / Auto" }, tagline: "Nimble through narrow lanes",
  },
  {
    id: "baleno", name: "Baleno", category: "Budget",
    image: "/cars/baleno.png",
    pricing: [{ type: "Manual", price: 1300 }, { type: "Auto", price: 1800 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Manual / Auto" }, tagline: "City glide, beach ready",
  },
  {
    id: "dzire", name: "Dzire", category: "Budget",
    image: "/cars/dzire.png",
    pricing: [{ type: "Manual", price: 1400 }, { type: "Auto", price: 1800 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Manual / Auto" }, tagline: "Sedan comfort at every turn",
  },
  {
    id: "i20", name: "i20", category: "Budget",
    image: "/cars/i20.png",
    pricing: [{ type: "Manual", price: 1400 }, { type: "Auto", price: 1800 }, { type: "Sunroof", price: 2000 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Manual / Auto" }, tagline: "Open roof, open roads",
  },
  {
    id: "fronx", name: "Fronx", category: "Budget",
    image: "/cars/fronx.png",
    pricing: [{ type: "Auto", price: 2000 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Automatic" }, tagline: "Compact crossover confidence",
  },
  {
    id: "brezza", name: "Brezza", category: "Budget",
    image: "/cars/brezza.png",
    pricing: [{ type: "Manual", price: 2000 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Manual" }, tagline: "Bold stance, easy drive",
  },

  // ── SUVs ─────────────────────────────────────────────────────────────────────
  {
    id: "venue", name: "Venue", category: "SUV",
    image: "/cars/venue.png",
    pricing: [{ type: "Manual", price: 2500 }, { type: "Auto", price: 3000 }],
    specs: { seats: 5, fuel: "Petrol / Diesel", transmission: "Manual / Auto" }, tagline: "Urban SUV, coastal soul",
  },
  {
    id: "creta", name: "Creta", category: "SUV",
    image: "/cars/creta.png",
    pricing: [{ type: "Manual", price: 2500 }, { type: "Auto", price: 3500 }],
    specs: { seats: 5, fuel: "Petrol / Diesel", transmission: "Manual / Auto" }, tagline: "Goa's favourite all-rounder",
  },
  {
    id: "seltos", name: "Seltos", category: "SUV",
    image: "/cars/seltos.png",
    pricing: [{ type: "Auto", price: 3000 }],
    specs: { seats: 5, fuel: "Petrol / Diesel", transmission: "Automatic" }, tagline: "Premium ride, every road",
  },
  {
    id: "alcazar", name: "Alcazar", category: "SUV",
    image: "/cars/alcazar.png",
    pricing: [{ type: "Auto", price: 3500 }],
    specs: { seats: 6, fuel: "Diesel", transmission: "Automatic" }, tagline: "Six in comfort, none left behind",
  },
  {
    id: "hycross", name: "Hycross", category: "SUV",
    image: "/cars/hycross.png",
    pricing: [{ type: "Auto", price: 3500 }],
    specs: { seats: 7, fuel: "Hybrid", transmission: "Automatic" }, tagline: "Seven seats, green conscience",
  },
  {
    id: "carens", name: "Carens", category: "SUV",
    image: "/cars/carens.png",
    pricing: [{ type: "Manual", price: 2500 }],
    specs: { seats: 7, fuel: "Diesel", transmission: "Manual" }, tagline: "Family adventures, fully loaded",
  },
  {
    id: "ertiga", name: "Ertiga", category: "SUV",
    image: "/cars/ertiga.png",
    pricing: [{ type: "Manual", price: 2300 }, { type: "Auto", price: 2800 }],
    specs: { seats: 7, fuel: "Petrol / CNG", transmission: "Manual / Auto" }, tagline: "The practical family choice",
  },

  // ── PREMIUM / OFF-ROAD ───────────────────────────────────────────────────────
  {
    id: "thar", name: "Thar", category: "Premium",
    image: "/cars/thar.png",
    pricing: [{ type: "Manual", price: 3000 }, { type: "Auto", price: 3500 }],
    specs: { seats: 4, fuel: "Diesel", transmission: "Manual / Auto" }, tagline: "Born for the untamed Ghats",
  },
  {
    id: "thar-roxx", name: "Thar Roxx", category: "Premium",
    image: "/cars/thar-roxx.png",
    pricing: [{ type: "Base", price: 6000 }],
    specs: { seats: 5, fuel: "Diesel", transmission: "Automatic" }, tagline: "Roxx harder, roam freer",
  },
  {
    id: "crysta", name: "Crysta", category: "Premium",
    image: "/cars/crysta.png",
    pricing: [{ type: "Manual", price: 3000 }, { type: "Auto", price: 3500 }],
    specs: { seats: 7, fuel: "Diesel", transmission: "Manual / Auto" }, tagline: "Corporate comfort, Goa style",
  },
  {
    id: "fortuner", name: "Fortuner", category: "Premium",
    image: "/cars/fortuner.png",
    pricing: [{ type: "Base", price: 7000 }],
    specs: { seats: 7, fuel: "Diesel", transmission: "Automatic" }, tagline: "Command every road you take",
  },
  {
    id: "legender", name: "Legender", category: "Premium",
    image: "/cars/legender.png",
    pricing: [{ type: "Base", price: 8000 }],
    specs: { seats: 7, fuel: "Diesel", transmission: "Automatic" }, tagline: "The legend, elevated",
  },

  // ── LUXURY ───────────────────────────────────────────────────────────────────
  {
    id: "bmw-5", name: "BMW 5 Series", category: "Luxury",
    image: "/cars/bmw-5.png",
    pricing: [{ type: "Base", price: 15000 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Automatic" }, tagline: "The ultimate driving machine",
  },
  {
    id: "mini", name: "Mini Cooper", category: "Luxury",
    image: "/cars/mini.png",
    pricing: [{ type: "Base", price: 18000 }],
    specs: { seats: 4, fuel: "Petrol", transmission: "Automatic" }, tagline: "British icon, Goan spirit",
  },
  {
    id: "audi-conv", name: "Audi Convertible", category: "Luxury",
    image: "/cars/audi-conv.png",
    pricing: [{ type: "Base", price: 26000 }],
    specs: { seats: 4, fuel: "Petrol", transmission: "Automatic" }, tagline: "Open sky, open throttle",
  },
  {
    id: "merc-c300", name: "Mercedes C300", category: "Luxury",
    image: "/cars/merc-c300.png",
    pricing: [{ type: "Base", price: 34000 }],
    specs: { seats: 5, fuel: "Petrol", transmission: "Automatic" }, tagline: "Where precision meets prestige",
  },
  {
    id: "bmw-z4", name: "BMW Z4", category: "Luxury",
    image: "/cars/bmw-z4.png",
    pricing: [{ type: "Base", price: 30000 }],
    specs: { seats: 2, fuel: "Petrol", transmission: "Automatic" }, tagline: "Two seats. Zero inhibitions.",
  },
];

const heritageData = [
  { title: "Shri Mangeshi Temple", category: "Temples", description: "The largest and most visited temple in Goa, dedicated to Lord Mangesh.", link: "https://maps.google.com/?q=Shri+Mangeshi+Temple+Goa", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80" },
  { title: "Dudhsagar Waterfalls", category: "Directions", description: "One of India's tallest waterfalls, best reached by a scenic jungle drive.", link: "https://maps.google.com/?q=Dudhsagar+Waterfalls+Goa", image: "https://images.unsplash.com/photo-1579975096649-e773152b04cb?auto=format&fit=crop&w=800&q=80" },
];

const CATEGORIES = ["Budget", "SUV", "Premium", "Luxury"] as const;

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contacts: z.string().min(7, "Contact number is required"),
  altContact: z.string().optional(),
  carId: z.string().optional(),
  days: z.coerce.number().min(2, "Minimum 2 days required").optional(),
  transmission: z.enum(["Automatic", "Manual", "Any"]).optional(),
  pickupPlace: z.string().min(2, "Pickup location is required"),
  dropPlace: z.string().min(2, "Drop location is required"),
  pickupDate: z.date({ required_error: "Pickup date is required" }),
  pickupTime: z.string().optional(),
  dropDate: z.date().optional(),
  dropTime: z.string().optional(),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Budget");
  const [activeCar, setActiveCar] = useState<CarItem | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [carSearchText, setCarSearchText] = useState("");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      contacts: "",
      altContact: "",
      carId: activeCar?.id || "",
      days: 2,
      transmission: "Any",
      pickupPlace: "",
      dropPlace: "",
      pickupDate: new Date(),
      pickupTime: "",
      dropDate: undefined,
      dropTime: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    const selectedCar = data.carId ? carsData.find((c: CarItem) => c.id === data.carId) : null;
    const carName = selectedCar?.name || activeCar?.name || "";
    const carSpecTransmission = (selectedCar?.specs?.transmission || activeCar?.specs?.transmission) ?? "";
    const chosenTransmission = data.transmission && data.transmission !== "Any" ? data.transmission : carSpecTransmission || "Any";

    const pickupDateStr = data.pickupDate ? format(data.pickupDate, "PPP") : "";
    const dropDateStr = data.dropDate ? format(data.dropDate, "PPP") : "";

    const msg = `*Thank you for contacting VARDA CAR  RENTAL GOA! Please let us know how we can help you.*%0A%0A*New Booking -Varda Car Rentals*%0A%0A- Name : ${encodeURIComponent(
      data.name
    )}%0A- Contacts: ${encodeURIComponent(data.contacts)}%0A- Alternate contact : ${encodeURIComponent(data.altContact || "")} %0A- Days : ${encodeURIComponent(String(data.days || ""))}%0A- Car Auto & Manual: ${encodeURIComponent(
      `${carName ? carName + " · " : ""}${chosenTransmission}`
    )}%0A- Pickup location : ${encodeURIComponent(data.pickupPlace)}%0A- Date : ${encodeURIComponent(pickupDateStr)}%0A- Time : ${encodeURIComponent(data.pickupTime || "")}%0A- Drop location: ${encodeURIComponent(data.dropPlace)}%0A- Date: ${encodeURIComponent(dropDateStr)}%0A- Time : ${encodeURIComponent(data.dropTime || "")}%0A%0ANote:- Minimum 2 days booking is required to rent all self drive vehicles from us.%0AWe Don't Provide Self Drive Cars For 1 Day...%0A%0AFor Booking Enquiry : %0AContact us : 9371548253 / 7666357013%0AThankyou ...`;

    window.open(`https://wa.me/919371548253?text=${msg}`, "_blank");
    setBookingOpen(false);
    form.reset();
    setCarSearchText("");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const openBooking = (car?: CarItem) => {
    setActiveCar(car ?? null);
    form.setValue("carId", car?.id || "");
    setCarSearchText(car?.name || "");
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CarRental",
          name: "Varda Car Rentals",
          url: "https://varda.example.com/",
          description: "Premium cab rental and self-drive car hire in Goa for airport transfers, sightseeing, beach trips, and wedding travel.",
          areaServed: ["Goa", "North Goa", "South Goa", "Dabolim Airport", "Panaji"],
          telephone: "+91-9371548253",
          priceRange: "₹1200 - ₹34000",
          sameAs: ["https://www.instagram.com/"],
          availableService: [
            "Cab rental in Goa",
            "Self-drive car rental in Goa",
            "Airport transfer in Goa",
            "Goa sightseeing car hire"
          ]
        })
      }} />

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Varda Car Rentals"
              className="h-8 md:h-10 w-auto block rounded-sm"
              style={{ objectFit: "contain" }}
            />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/50 group-hover:text-white/70 transition-colors">GOA</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {["fleet", "heritage", "about", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Book Now */}
          <div className="hidden md:block">
            <button
              onClick={() => openBooking()}
              data-testid="button-book-now"
              className="text-[11px] font-medium uppercase tracking-[0.2em] border border-white/40 text-white px-5 py-2.5 rounded-full hover:bg-white hover:text-neutral-900 transition-all duration-300"
            >
              Book Now
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {["fleet", "heritage", "about", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="text-3xl font-serif text-white/80 hover:text-white transition-colors capitalize"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { openBooking(); setMobileMenuOpen(false); }}
              className="mt-4 border border-white/30 text-white text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:bg-white hover:text-neutral-900 transition-all"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/hero.png"
            alt="Varda luxury car on Goa coastal road"
            className="w-full h-full object-cover object-center scale-110"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-neutral-950/20" />
        </motion.div>

        {/* Hero content — left-bottom aligned */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-white/50 mb-5 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-white/30 inline-block" />
            Varda Car Rentals &middot; Goa
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.0] tracking-tight text-white max-w-3xl mb-6"
          >
            Rent a Cab in Goa<br />
            with Premium Self-Drive Car Rentals.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-white/55 font-light max-w-md mb-10 leading-relaxed"
          >
            Book a cab in Goa, airport transfer, or self-drive car rental for beach trips, hill drives, sightseeing, and wedding travel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => openBooking()}
              data-testid="button-book-drive"
              className="flex items-center gap-3 border border-white text-white text-[11px] uppercase tracking-[0.2em] font-medium px-7 py-3.5 rounded-sm hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
            >
              Book Your Drive
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("fleet")}
              data-testid="button-explore-fleet"
              className="flex items-center gap-3 border border-white/30 text-white/80 text-[11px] uppercase tracking-[0.2em] font-medium px-7 py-3.5 rounded-sm hover:border-white hover:text-white transition-all duration-300"
            >
              Explore Fleet
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 right-8 md:right-10 z-10 flex items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">Scroll</span>
          <div className="w-12 h-px bg-white/25" />
        </motion.div>
      </section>

      {/* ── FLEET ──────────────────────────────────────────────────────────── */}
      <section id="fleet" className="py-28 md:py-40 px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4"
            >
              Our Collection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-white"
            >
              The Fleet
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-white/40 font-light max-w-xs md:text-right leading-relaxed"
          >
            From nimble hatchbacks for the narrow lanes of Fontainhas to commanding SUVs for the Western Ghats.
          </motion.p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-12 border-b border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-testid={`tab-category-${cat.toLowerCase()}`}
              className={cn(
                "text-[11px] uppercase tracking-[0.2em] font-medium px-5 py-3 transition-all border-b-2 -mb-px",
                activeCategory === cat
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/70"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Car grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5"
          >
            {carsData.filter((c: CarItem) => c.category === activeCategory).map((car: CarItem, idx: number) => (
              <motion.button
                key={car.id}
                data-testid={`card-car-${car.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveCar(car)}
                className="group text-left bg-neutral-950 p-0 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-neutral-900">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent" />
                </div>

                {/* Info row */}
                <div className="px-6 py-5 flex items-start justify-between bg-neutral-950 border-t border-white/5 group-hover:bg-neutral-900/50 transition-colors">
                  <div>
                    <h3 className="text-base font-serif text-white mb-1 group-hover:text-white/90 transition-colors">{car.name}</h3>
                    <p className="text-[11px] text-white/35 uppercase tracking-wider">
                      From ₹{Math.min(...car.pricing.map(p => p.price)).toLocaleString("en-IN")} / day
                    </p>
                  </div>
                  <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300 mt-1 shrink-0">
                    <ArrowUpRight size={13} className="text-white/50 group-hover:text-neutral-900 transition-colors" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── CAR DETAIL OVERLAY ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeCar && (
          <Dialog open={!!activeCar} onOpenChange={(open) => !open && setActiveCar(null)}>
            <DialogContent className="max-w-5xl w-[96vw] p-0 border-0 bg-neutral-950 rounded-none overflow-hidden shadow-2xl" aria-describedby="car-detail-desc">
              <DialogTitle className="sr-only">{activeCar.name} — Details</DialogTitle>
              <DialogDescription id="car-detail-desc" className="sr-only">
                Specifications and pricing for {activeCar.name}
              </DialogDescription>
              <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
                {/* Image panel */}
                <div className="w-full md:w-1/2 relative bg-neutral-900 shrink-0" style={{ minHeight: 240 }}>
                  <img src={activeCar.image} alt={activeCar.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">{activeCar.category}</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">{activeCar.name}</h2>
                    <p className="text-sm text-white/50 mt-2 italic">{activeCar.tagline}</p>
                  </div>
                </div>

                {/* Details panel */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {/* Specs */}
                  <div className="p-8 md:p-10 border-b border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-6">Specifications</p>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                          <Users size={13} />
                          <span className="text-[10px] uppercase tracking-wider">Seating</span>
                        </div>
                        <p className="text-white font-medium">{activeCar.specs.seats} Adults</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                          <Fuel size={13} />
                          <span className="text-[10px] uppercase tracking-wider">Fuel</span>
                        </div>
                        <p className="text-white font-medium">{activeCar.specs.fuel}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                          <Settings2 size={13} />
                          <span className="text-[10px] uppercase tracking-wider">Gearbox</span>
                        </div>
                        <p className="text-white font-medium text-sm">{activeCar.specs.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-8 md:p-10 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-6">Daily Rates</p>
                    <div className="space-y-3">
                      {activeCar.pricing.map((p, i) => (
                        <div key={i} className="flex items-center justify-between py-3.5 border-b border-white/5">
                          <span className="text-sm text-white/60">{p.type}</span>
                          <span className="text-xl font-serif text-white">₹{p.price.toLocaleString("en-IN")}<span className="text-xs text-white/30 font-sans ml-1">/ day</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Book CTA */}
                  <div className="p-8 md:p-10 pt-0">
                    <button
                      onClick={() => { setActiveCar(null); openBooking(activeCar); }}
                      data-testid="button-book-whatsapp"
                      className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 text-[11px] uppercase tracking-[0.25em] font-semibold py-4 rounded-sm hover:bg-white/90 transition-colors"
                    >
                      Book via WhatsApp
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── BOOKING MODAL ──────────────────────────────────────────────────── */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[520px] bg-neutral-950 border border-white/10 rounded-none p-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-neutral-950 border-b border-white/10 p-8 pb-6">
            <DialogTitle className="text-2xl font-serif text-white">Request a Drive</DialogTitle>
            <DialogDescription className="text-sm text-white/40 mt-2">
              {activeCar ? `${activeCar.name} · ` : ""}We'll confirm availability on WhatsApp.
            </DialogDescription>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-8 py-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-name" placeholder="Your name" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Contact & Alternate */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contacts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Contact</FormLabel>
                      <FormControl>
                        <Input data-testid="input-contacts" placeholder="Phone number" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="altContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Alternate (optional)</FormLabel>
                      <FormControl>
                        <Input data-testid="input-alt-contact" placeholder="Alternate phone" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Car Selection */}
              <FormField
                control={form.control}
                name="carId"
                render={({ field }) => {
                  const filteredCars = carsData.filter((car: CarItem) =>
                    car.name.toLowerCase().includes(carSearchText.toLowerCase()) ||
                    car.category.toLowerCase().includes(carSearchText.toLowerCase())
                  );
                  const selectedCarObj = carsData.find((c: CarItem) => c.id === field.value);
                  return (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Select Car (optional)</FormLabel>
                      <FormControl>
                        <div className="mt-2 relative">
                          <Input
                            placeholder="Search cars..."
                            value={carSearchText}
                            onChange={(e) => setCarSearchText(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10"
                          />
                          {carSearchText && filteredCars.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-neutral-900 border border-white/10 border-t-0 max-h-48 overflow-y-auto z-50">
                              {filteredCars.map((car: CarItem) => (
                                <button
                                  key={car.id}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(car.id);
                                    setCarSearchText(car.name);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 border-b border-white/5 last:border-0"
                                >
                                  {car.name} <span className="text-white/40">- ₹{car.pricing[0].price.toLocaleString("en-IN")}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedCarObj && (
                            <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded text-sm text-white">
                              ✓ {selectedCarObj.name}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  );
                }}
              />

              {/* Pickup Location & Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Pickup Location</FormLabel>
                      <FormControl>
                        <div className="mt-2 relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                          <Input data-testid="input-pickup" placeholder="Airport / Hotel" className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Pickup Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              data-testid="button-pickup-date-picker"
                              type="button"
                              className={cn(
                                "mt-2 w-full h-10 px-3 text-left text-sm bg-white/5 border border-white/10 text-white rounded-none hover:bg-white/10 transition-colors",
                                !field.value && "text-white/30"
                              )}
                            >
                              {field.value ? format(field.value, "dd MMM yy") : "Pick date"}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-950 border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pickup Time & Days */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Pickup Time (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          data-testid="input-pickup-time"
                          className="mt-2 bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10 [color-scheme:dark]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Days (min 2)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2}
                          data-testid="input-days"
                          placeholder="2"
                          className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Drop Location & Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dropPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Drop Location</FormLabel>
                      <FormControl>
                        <div className="mt-2 relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                          <Input data-testid="input-drop" placeholder="Airport / Hotel" className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dropDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Drop Date (optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              data-testid="button-drop-date-picker"
                              type="button"
                              className={cn(
                                "mt-2 w-full h-10 px-3 text-left text-sm bg-white/5 border border-white/10 text-white rounded-none hover:bg-white/10 transition-colors",
                                !field.value && "text-white/30"
                              )}
                            >
                              {field.value ? format(field.value, "dd MMM yy") : "Pick date"}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-950 border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Drop Time & Transmission */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dropTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Drop Time (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          data-testid="input-drop-time"
                          className="mt-2 bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-0 focus-visible:border-white/40 h-10 [color-scheme:dark]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Transmission</FormLabel>
                      <FormControl>
                        <select {...field} className="mt-2 w-full h-10 px-3 text-sm bg-white/5 border border-white/10 text-white rounded-none focus-visible:ring-0 focus-visible:border-white/40">
                          <option value="Any">Any</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Save & Send Button */}
              <button
                type="submit"
                data-testid="button-confirm-booking"
                className="w-full mt-8 bg-white text-neutral-900 text-[11px] uppercase tracking-[0.25em] font-semibold py-3 rounded-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                Confirm & Send to WhatsApp
                <ArrowUpRight size={14} />
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── ABOUT ──────────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 md:py-40 bg-neutral-900/30">
        <div className="px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 mb-5">Who We Are</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
                Goa, driven the way it should be.
              </h2>
              <p className="text-sm text-white/50 leading-loose mb-6">
                Varda is a curated car rental service built for travellers who believe the journey is as important as the destination. We handpick every vehicle for comfort, reliability, and character — then pair it with service that feels personal, not transactional.
              </p>
              <p className="text-sm text-white/40 leading-loose">
                Whether you're chasing sunsets on the Calangute coast or navigating the jungle roads to Dudhsagar, we have the right car and the local knowledge to make it unforgettable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="grid grid-cols-2 gap-px bg-white/5"
            >
              {[
                { num: "22+", label: "Curated vehicles" },
                { num: "4", label: "Fleet categories" },
                { num: "24/7", label: "WhatsApp support" },
                { num: "Goa", label: "Our only focus" },
              ].map((stat) => (
                <div key={stat.label} className="bg-neutral-950 p-8">
                  <p className="text-3xl font-serif text-white mb-2">{stat.num}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HERITAGE GUIDE ─────────────────────────────────────────────────── */}
      <section id="heritage" className="py-28 md:py-40 px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[11px] uppercase tracking-[0.3em] text-white/30 mb-4"
            >
              Explore With Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-white"
            >
              Hidden Goa
            </motion.h2>
          </div>
          <p className="text-sm text-white/35 max-w-xs md:text-right leading-relaxed">
            Temples, forts, and waterfalls most tourists never reach. Your car opens the door.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {heritageData.map((place, idx) => (
            <motion.a
              key={place.title}
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`card-heritage-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group block bg-neutral-950 overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img src={place.image} alt={place.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">{place.category}</p>
                  <h3 className="text-base font-serif text-white mb-2 leading-snug">{place.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">{place.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-white/50 group-hover:text-white transition-colors">
                    <ExternalLink size={11} />
                    <span className="text-[10px] uppercase tracking-wider">Open in Maps</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── FOOTER / CONTACT ───────────────────────────────────────────────── */}
      <footer id="contact" className="border-t border-white/5">
        <div className="px-6 md:px-10 lg:px-16 max-w-screen-xl mx-auto py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo.jpg" alt="Varda Car Rentals" className="h-10 w-auto block rounded-sm" style={{objectFit: 'contain'}} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-5">Car Rentals &middot; Goa</p>
              <p className="text-xs text-white/35 leading-relaxed max-w-xs">
                Premium car rentals for discerning travellers exploring Goa's coastline, heritage, and wilderness.
              </p>
            </div>

            {/* Contact */}
            <div id="contact-details">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-6">Contact</p>
              <div className="space-y-4">
                <a href="tel:9371548253" data-testid="link-phone" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group">
                  <Phone size={13} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  9371548253
                </a>
                <a href="tel:7666357013" data-testid="link-phone-alt" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group">
                  <Phone size={13} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  7666357013
                </a>
                <a href="mailto:vardaa1223@gmail.com" data-testid="link-email" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group">
                  <Mail size={13} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  vardaa1223@gmail.com
                </a>
              </div>
            </div>

            {/* Book CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">Ready to drive?</p>
                <p className="text-sm text-white/40 leading-relaxed mb-6">Book your car now — we'll confirm within minutes on WhatsApp.</p>
              </div>
              <button
                onClick={() => openBooking()}
                data-testid="button-footer-book"
                className="self-start flex items-center gap-3 border border-white/30 text-white text-[11px] uppercase tracking-[0.2em] font-medium px-6 py-3 rounded-sm hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
              >
                Book Now
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[11px] text-white/20">
              &copy; {new Date().getFullYear()} Varda Car Rentals. All rights reserved.
            </p>
             <div className="flex gap-6">
              {[
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-[11px] text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
