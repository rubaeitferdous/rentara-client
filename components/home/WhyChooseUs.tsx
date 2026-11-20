import {
  ShieldCheck,
  CreditCard,
  Clock,
  BadgeDollarSign,
  Headphones,
  CheckCircle,
} from "lucide-react";

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: BadgeDollarSign,
      title: "Affordable & Transparent Rates",
      description:
        "Competitive daily, weekly, and monthly rates directly set by equipment owners with no hidden intermediary brokerage fees.",
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Equipment Owners",
      description:
        "Every machinery listing and fleet owner is verified with government ID, business licensing, and maintenance logs.",
    },
    {
      icon: Clock,
      title: "Flexible Rental Horizons",
      description:
        "Whether you need an 8K camera body for a single weekend shoot or a 20-ton excavator for a 6-month infrastructure build.",
    },
    {
      icon: CreditCard,
      title: "Stripe-Secured Escrow Payments",
      description:
        "Funds are securely escrowed through Stripe until dispatch and booking confirmation, guaranteeing safety for both parties.",
    },
    {
      icon: Headphones,
      title: "24/7 Field & Operational Support",
      description:
        "Dedicated rental concierge on standby to assist with on-site dispatch logistics, operators, and replacement support.",
    },
    {
      icon: CheckCircle,
      title: "Collision & Overbooking Prevention",
      description:
        "Real-time dynamic stock engines continuously cross-verify dates so your reservation is always guaranteed.",
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-card/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge-warm">Why Rentara</span>
          <h2 className="section-title">Engineered for Reliable Performance</h2>
          <p className="section-sub">
            We eliminate capital depreciation, idle storage costs, and downtime risks
            by pairing renters with top-tier equipment owners.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="warm-card p-6 flex flex-col justify-between hover:border-amber-500/30"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
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
