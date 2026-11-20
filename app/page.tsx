import Banner from "@/components/home/Banner";
import FeaturedSection from "@/components/home/FeaturedSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsSection from "@/components/home/ReviewsSection";
import OwnerCTA from "@/components/home/OwnerCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner with Framer Motion */}
      <Banner />

      {/* Featured Equipment (6 approved items with MongoDB limit) */}
      <FeaturedSection />

      {/* Categories Grid with Framer Motion */}
      <CategoriesSection />

      {/* How It Works (Extra Section 1) */}
      <HowItWorks />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Customer Reviews (4+ Reviews) */}
      <ReviewsSection />

      {/* Owner Monetization CTA (Extra Section 2) */}
      <OwnerCTA />
    </div>
  );
}
