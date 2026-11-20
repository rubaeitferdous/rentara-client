import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Tariqul Islam",
      role: "Lead Project Engineer, Metro Infrastructure",
      rating: 5,
      comment:
        "Renting two CAT 320 excavators through Rentara saved our civil contractor team over 3 weeks of delay. Delivery to the Gulshan site was on time, equipment was spotless, and the billing was completely transparent.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      project: "CAT 320 Excavator Fleet",
    },
    {
      name: "Sabrina Rahman",
      role: "Director of Photography, RedDot Cinema",
      rating: 5,
      comment:
        "The Sony FX6 and cinema lens package we booked for our commercial shoot was in mint condition. The real-time calendar and instant Stripe checkout made paperwork effortless.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      project: "Sony FX6 Cinema Kit",
    },
    {
      name: "Kamrul Hasan",
      role: "Agricultural Operations Manager, North Ag",
      rating: 5,
      comment:
        "Rented the Mahindra 575 DI tractor during peak tilling season in Bogura. Having the weekly rental flexibility saved us significant capital compared to purchasing new machinery.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      project: "Mahindra Farm Tractor",
    },
    {
      name: "Farhan Ahmed",
      role: "Production Lead, Apex Live Festivals",
      rating: 5,
      comment:
        "The Yamaha STAGEPAS line array system delivered pristine acoustic clarity across 1,200 attendees. Owner communication was instant and professional. Rentara is our new go-to.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      project: "Yamaha Concert Sound Rig",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge-warm">Client Testimonials</span>
          <h2 className="section-title">Trusted by Field Professionals</h2>
          <p className="section-sub">
            Real feedback from civil engineers, cinema directors, fleet operators, and event producers.
          </p>
        </div>

        {/* 4 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="warm-card p-6 flex flex-col justify-between relative hover:border-amber-500/30"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 mt-4 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30 bg-muted shrink-0">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-foreground truncate">
                    {r.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {r.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
