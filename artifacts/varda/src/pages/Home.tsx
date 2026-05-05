import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Car, ChevronRight, X, ChevronDown, Check, Menu } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- DATA ---

type CarPricing = {
  type: string;
  price: number;
};

type CarItem = {
  id: string;
  name: string;
  category: "Budget" | "SUV" | "Premium" | "Luxury";
  image: string;
  pricing: CarPricing[];
  specs: {
    seats: number;
    fuel: string;
    transmission: string;
  };
};

const fleetData: CarItem[] = [
  // Budget
  { id: "swift", name: "Swift", category: "Budget", image: "/budget.png", pricing: [{ type: "Manual", price: 1200 }, { type: "Auto", price: 1600 }], specs: { seats: 5, fuel: "Petrol", transmission: "Manual/Auto" } },
  { id: "baleno", name: "Baleno", category: "Budget", image: "/budget.png", pricing: [{ type: "Manual", price: 1300 }, { type: "Auto", price: 1800 }], specs: { seats: 5, fuel: "Petrol", transmission: "Manual/Auto" } },
  { id: "dzire", name: "Dzire", category: "Budget", image: "/budget.png", pricing: [{ type: "Manual", price: 1400 }, { type: "Auto", price: 1800 }], specs: { seats: 5, fuel: "Petrol", transmission: "Manual/Auto" } },
  { id: "i20", name: "i20", category: "Budget", image: "/budget.png", pricing: [{ type: "Manual", price: 1400 }, { type: "Auto", price: 1800 }, { type: "Sunroof", price: 2000 }], specs: { seats: 5, fuel: "Petrol", transmission: "Manual/Auto" } },
  { id: "fronx", name: "Fronx", category: "Budget", image: "/budget.png", pricing: [{ type: "Auto", price: 2000 }], specs: { seats: 5, fuel: "Petrol", transmission: "Auto" } },
  { id: "brezza", name: "Brezza", category: "Budget", image: "/budget.png", pricing: [{ type: "Manual", price: 2000 }], specs: { seats: 5, fuel: "Petrol", transmission: "Manual" } },
  
  // SUVs
  { id: "venue", name: "Venue", category: "SUV", image: "/suv.png", pricing: [{ type: "Manual", price: 2500 }, { type: "Auto", price: 3000 }], specs: { seats: 5, fuel: "Petrol/Diesel", transmission: "Manual/Auto" } },
  { id: "creta", name: "Creta", category: "SUV", image: "/suv.png", pricing: [{ type: "Manual", price: 2500 }, { type: "Auto", price: 3500 }], specs: { seats: 5, fuel: "Petrol/Diesel", transmission: "Manual/Auto" } },
  { id: "seltos", name: "Seltos", category: "SUV", image: "/suv.png", pricing: [{ type: "Auto", price: 3000 }], specs: { seats: 5, fuel: "Petrol/Diesel", transmission: "Auto" } },
  { id: "alcazar", name: "Alcazar", category: "SUV", image: "/suv.png", pricing: [{ type: "Auto", price: 3500 }], specs: { seats: 6, fuel: "Diesel", transmission: "Auto" } },
  { id: "hycross", name: "Hycross", category: "SUV", image: "/suv.png", pricing: [{ type: "Auto", price: 3500 }], specs: { seats: 7, fuel: "Hybrid", transmission: "Auto" } },
  { id: "carens", name: "Carens", category: "SUV", image: "/suv.png", pricing: [{ type: "Manual", price: 2500 }], specs: { seats: 7, fuel: "Diesel", transmission: "Manual" } },
  { id: "ertiga", name: "Ertiga", category: "SUV", image: "/suv.png", pricing: [{ type: "Manual", price: 2300 }, { type: "Auto", price: 2800 }], specs: { seats: 7, fuel: "Petrol/CNG", transmission: "Manual/Auto" } },

  // Premium / Off-road
  { id: "thar", name: "Thar", category: "Premium", image: "/premium.png", pricing: [{ type: "Manual", price: 3000 }, { type: "Auto", price: 3500 }], specs: { seats: 4, fuel: "Diesel", transmission: "Manual/Auto" } },
  { id: "thar-roxx", name: "Thar Roxx", category: "Premium", image: "/premium.png", pricing: [{ type: "Base", price: 6000 }], specs: { seats: 5, fuel: "Diesel", transmission: "Auto" } },
  { id: "crysta", name: "Crysta", category: "Premium", image: "/premium.png", pricing: [{ type: "Manual", price: 3000 }, { type: "Auto", price: 3500 }], specs: { seats: 7, fuel: "Diesel", transmission: "Manual/Auto" } },
  { id: "fortuner", name: "Fortuner", category: "Premium", image: "/premium.png", pricing: [{ type: "Base", price: 7000 }], specs: { seats: 7, fuel: "Diesel", transmission: "Auto" } },
  { id: "legender", name: "Legender", category: "Premium", image: "/premium.png", pricing: [{ type: "Base", price: 8000 }], specs: { seats: 7, fuel: "Diesel", transmission: "Auto" } },

  // Luxury
  { id: "bmw-5", name: "BMW 5 Series", category: "Luxury", image: "/luxury.png", pricing: [{ type: "Base", price: 15000 }], specs: { seats: 5, fuel: "Petrol", transmission: "Auto" } },
  { id: "mini", name: "Mini Cooper", category: "Luxury", image: "/luxury.png", pricing: [{ type: "Base", price: 18000 }], specs: { seats: 4, fuel: "Petrol", transmission: "Auto" } },
  { id: "audi-conv", name: "Audi Convertible", category: "Luxury", image: "/luxury.png", pricing: [{ type: "Base", price: 26000 }], specs: { seats: 4, fuel: "Petrol", transmission: "Auto" } },
  { id: "merc-c300", name: "Mercedes C300", category: "Luxury", image: "/luxury.png", pricing: [{ type: "Base", price: 34000 }], specs: { seats: 5, fuel: "Petrol", transmission: "Auto" } },
  { id: "bmw-z4", name: "BMW Z4", category: "Luxury", image: "/luxury.png", pricing: [{ type: "Base", price: 30000 }], specs: { seats: 2, fuel: "Petrol", transmission: "Auto" } },
];

const heritageGuide = [
  { title: "Shri Mangeshi Temple", category: "Temples", link: "https://maps.google.com/?q=Shri+Mangeshi+Temple", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80" },
  { title: "Basilica of Bom Jesus", category: "Heritage", link: "https://maps.google.com/?q=Basilica+of+Bom+Jesus", image: "https://images.unsplash.com/photo-1555523910-40e1b1d4dd06?auto=format&fit=crop&w=800&q=80" },
  { title: "Fort Aguada", category: "Heritage", link: "https://maps.google.com/?q=Fort+Aguada", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e4f2?auto=format&fit=crop&w=800&q=80" },
  { title: "Dudhsagar Waterfalls", category: "Directions", link: "https://maps.google.com/?q=Dudhsagar+Waterfalls", image: "https://images.unsplash.com/photo-1579975096649-e773152b04cb?auto=format&fit=crop&w=800&q=80" },
];

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  pickupPlace: z.string().min(2, "Pickup location is required"),
  dropPlace: z.string().min(2, "Drop location is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// --- COMPONENTS ---

export default function Home() {
  const [activeCar, setActiveCar] = useState<CarItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      pickupPlace: "",
      dropPlace: "",
      time: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    const message = `*New Booking Request*%0A%0A*Name:* ${data.name}%0A*Car:* ${activeCar?.name}%0A*Pickup:* ${data.pickupPlace}%0A*Drop:* ${data.dropPlace}%0A*Date:* ${format(data.date, "PPP")}%0A*Time:* ${data.time}`;
    window.open(`https://wa.me/917666357013?text=${message}`, "_blank");
    setIsBookingModalOpen(false);
    form.reset();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans overflow-x-hidden">
      {/* STICKY NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif font-medium tracking-wide text-primary">Varda</div>
          
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-muted-foreground">
            <button onClick={() => scrollToSection("fleet")} className="hover:text-primary transition-colors">The Fleet</button>
            <button onClick={() => scrollToSection("heritage")} className="hover:text-primary transition-colors">Heritage Guide</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">Contact</button>
            <Button 
              variant="outline" 
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary rounded-full px-6"
              onClick={() => {
                setActiveCar(null);
                setIsBookingModalOpen(true);
              }}
            >
              Book Now
            </Button>
          </div>
          
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-serif">
              <button onClick={() => scrollToSection("fleet")} className="text-left py-4 border-b border-white/10">The Fleet</button>
              <button onClick={() => scrollToSection("heritage")} className="text-left py-4 border-b border-white/10">Heritage Guide</button>
              <button onClick={() => scrollToSection("contact")} className="text-left py-4 border-b border-white/10">Contact</button>
              <Button 
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                onClick={() => {
                  setActiveCar(null);
                  setIsBookingModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, opacity }}
        >
          <img 
            src="/hero.png" 
            alt="Luxury Car in Goa" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight tracking-tight text-white mb-6"
          >
            Premium Wheels for Your <span className="text-primary italic">Goa</span> Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12"
          >
            Unhurried, elegant, attentive. Experience the finest way to explore the coastal roads.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-medium tracking-wide shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:-translate-y-1"
              onClick={() => scrollToSection("fleet")}
            >
              Explore the Fleet
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/50 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={32} strokeWidth={1} />
        </motion.div>
      </section>

      {/* THE FLEET */}
      <section id="fleet" className="py-32 px-6 max-w-7xl mx-auto relative z-20 bg-background">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-semibold">Our Collection</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-medium text-white">The Fleet</h3>
          </div>
          <p className="text-muted-foreground font-light max-w-md md:text-right">
            From nimble hatchbacks for the narrow lanes of Fontainhas to commanding SUVs for the Western Ghats.
          </p>
        </div>

        <Tabs defaultValue="Luxury" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 glass bg-transparent mb-16 p-1 rounded-full border border-white/10">
            {["Budget", "SUV", "Premium", "Luxury"].map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-medium tracking-wide"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {["Budget", "SUV", "Premium", "Luxury"].map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {fleetData.filter(car => car.category === cat).map((car, idx) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => setActiveCar(car)}
                  >
                    <div className="glass rounded-2xl overflow-hidden border border-white/5 bg-white/5 transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                      <div className="aspect-[4/3] relative overflow-hidden bg-black">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                          <h4 className="text-2xl font-serif text-white group-hover:text-primary transition-colors">{car.name}</h4>
                          <span className="text-sm font-medium text-white/70">From ₹{Math.min(...car.pricing.map(p => p.price))}</span>
                        </div>
                      </div>
                      <div className="p-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Car size={14}/> {car.specs.seats}</span>
                          <span className="flex items-center gap-1">{car.specs.transmission.split('/')[0]}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CAR DETAIL OVERLAY */}
      <AnimatePresence>
        {activeCar && (
          <Dialog open={!!activeCar} onOpenChange={(open) => !open && setActiveCar(null)}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-background border-white/10 glass rounded-2xl">
              <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                <div className="w-full md:w-1/2 h-64 md:h-full relative bg-black">
                  <img 
                    src={activeCar.image} 
                    alt={activeCar.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
                  <div className="absolute bottom-8 left-8">
                    <div className="text-xs uppercase tracking-widest text-primary mb-2">{activeCar.category}</div>
                    <h2 className="text-4xl font-serif text-white">{activeCar.name}</h2>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col h-full overflow-y-auto no-scrollbar">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-6 text-white/90 border-b border-white/10 pb-4">Specifications</h3>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Seating</div>
                        <div className="text-white font-medium">{activeCar.specs.seats} Adults</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Fuel Type</div>
                        <div className="text-white font-medium">{activeCar.specs.fuel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Transmission</div>
                        <div className="text-white font-medium">{activeCar.specs.transmission}</div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mb-6 text-white/90 border-b border-white/10 pb-4">Daily Rates</h3>
                    <div className="space-y-4 mb-10">
                      {activeCar.pricing.map((price, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="text-white/80">{price.type}</span>
                          <span className="font-serif text-xl text-primary font-medium">₹{price.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-lg"
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      Book via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* BOOKING MODAL */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-white/10 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-medium">Request a Booking</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {activeCar ? `Booking for ${activeCar.name}. ` : ''}We'll confirm availability via WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-white/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Pickup Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input placeholder="Airport / Hotel" className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-white/20" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dropPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Drop Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input placeholder="Airport / Hotel" className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary text-white placeholder:text-white/20" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white/70">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-white/20">Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-white/10 text-white" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="bg-[#0a0a0a] text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input type="time" className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary text-white [color-scheme:dark]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-12 text-md font-medium">
                Confirm & Send to WhatsApp
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* GOA HERITAGE GUIDE */}
      <section id="heritage" className="py-32 px-6 bg-secondary/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-semibold">Curated Experiences</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6">Hidden Goa</h3>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              Discover the soul of Goa beyond the beaches. We've curated a list of heritage sites perfect for your premium drive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {heritageGuide.map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group block relative h-80 rounded-2xl overflow-hidden"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-xs uppercase tracking-widest text-primary mb-2">{item.category}</div>
                  <h4 className="text-xl font-serif text-white mb-2">{item.title}</h4>
                  <div className="flex items-center text-sm text-white/50 group-hover:text-primary transition-colors">
                    <MapPin size={14} className="mr-1" /> Open in Maps
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#050505] border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="text-3xl font-serif font-medium tracking-wide text-primary mb-6">Varda</div>
              <p className="text-muted-foreground font-light mb-8 max-w-sm">
                Elevating the standard of car rentals in Goa. Premium vehicles for discerning travelers.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-widest text-white mb-6 font-semibold">Contact</h4>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li><a href="tel:+917666357013" className="hover:text-primary transition-colors flex items-center gap-3"><Phone size={16} /> +91 7666357013</a></li>
                <li><a href="mailto:vardaa1223@gmail.com" className="hover:text-primary transition-colors">vardaa1223@gmail.com</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest text-white mb-6 font-semibold">Legal</h4>
              <ul className="space-y-4 text-muted-foreground font-light">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rental Agreement</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Varda Car Rental. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for the extraordinary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
