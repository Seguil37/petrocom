// src/features/tours/pages/HomePage.jsx

import HeroSection from '../components/HeroSection';
import WhyUsSection from '../components/WhyUsSection';
import CTASection from '../components/CTASection';
import PopularLocationsSection from '../components/PopularLocationsSection';
import FeaturedToursSection from '../components/FeaturedToursSection';
import FeaturedServiceSection from '../components/FeaturedServiceSection';
import PopularCountriesSection from '../components/PopularCountriesSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F4F5F6]" data-motion-page>
      <HeroSection />
      <PopularCountriesSection />
      <div data-motion-section>
        <CTASection />
      </div>
      <div data-motion-section>
        <FeaturedServiceSection />
      </div>
      <div data-motion-section>
        <FeaturedToursSection />
      </div>
      <div data-motion-section>
        <WhyUsSection />
      </div>
      <div data-motion-section>
        <PopularLocationsSection />
      </div>
    </div>
  );
};

export default HomePage;
