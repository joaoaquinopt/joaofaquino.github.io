"use client";

import { useEffect, useState } from "react";
import LatestRunCard from "../components/LatestRunCard";
import StatsOverview from "../components/StatsOverview";
import CTASection from "../components/CTASection";
import JourneySection from "../components/JourneySection";
import HeroSection from "../components/HeroSection";

export default function HomePage() {
  const [garminData, setGarminData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/garmin_summary.json")
      .then((res) => res.json())
      .then((data) => setGarminData(data))
      .catch((err) => console.error("Error loading Garmin data:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
      {/* Espaço entre Header e HeroSection */}
      <div className="mt-12 md:mt-20" />
      {/* HERO CENTRALIZADO EM CARD */}
      <HeroSection />

      {/* Espaço entre HeroSection e StatsOverview */}
      <div className="mt-8 md:mt-12" />
      {/* Stats Overview */}
      {garminData && (
        <StatsOverview
          stats={garminData.stats}
          thisWeek={garminData.this_week}
        />
      )}

      {/* Espaço entre StatsOverview e grid principal */}
      <div className="mt-8 md:mt-12" />
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8" id="runs">
        {/* Left Column: Latest Run Card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <LatestRunCard data={garminData?.latest_run} />
          </div>
        </div>

        {/* Right Column: Journey Section */}
        <section className="lg:col-span-2" id="journey">
          <JourneySection />
        </section>
      </div>

      {/* Espaço antes do CTA Section */}
      <div className="mt-8 md:mt-12" />
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
