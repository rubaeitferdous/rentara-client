import { Search, CalendarDays, CreditCard, RotateCcw } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Discover & Filter Gear",
      desc: "Browse certified equipment across 6 core industries with location, price range, and real-time date availability filters.",
    },
    {
      step: "02",
      icon: CalendarDays,
      title: "Select Rental Horizon",
      desc: "Specify exact start and end dates with transparent daily, weekly, or monthly pricing and quantity calculations.",
    },
    {
      step: "03",
      icon: CreditCard,
      title: "Stripe Escrow Checkout",
      desc: "Reserve gear securely. Funds are held in escrow until booking confirmation and equipment dispatch.",
    },
    {
      step: "04",
      icon: RotateCcw,
      title: "Field Deployment & Return",
      desc: "Receive nationwide equipment delivery with operational checklists, then easily return once the job is completed.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-card/60 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge-warm">Simple &amp; Transparent</span>
          <h2 className="section-title">How Rentara Works</h2>
          <p className="section-sub">
            A streamlined 4-step workflow that gets critical machinery onto your job
            site with zero friction.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="warm-card p-6 flex flex-col justify-between relative group hover:border-amber-500/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-amber-600/30 dark:text-amber-400/20 group-hover:text-amber-600/60 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
