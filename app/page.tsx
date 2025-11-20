"use client";

import { useEffect, useState } from "react";
import LatestRunCard from "../components/LatestRunCard";
import StatsOverview from "../components/StatsOverview";
import CTASection from "../components/CTASection";
import JourneySection from "../components/JourneySection";

export default function HomePage() {
  const [garminData, setGarminData] = useState<any>(null);

  useEffect(() => {
    // Load Garmin data
    fetch("/data/garmin_summary.json")
      .then((res) => res.json())
      .then((data) => setGarminData(data))
      .catch((err) => console.error("Error loading Garmin data:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 pb-20 space-y-12">
      {/* Stats Overview - Full Width */}
      {garminData && (
        <StatsOverview
          stats={garminData.stats}
          thisWeek={garminData.this_week}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Latest Run Card - Sticky */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <LatestRunCard data={garminData?.latest_run} />
          </div>
        </div>

        {/* Right Column: Journey Section */}
        <section className="lg:col-span-2">
          <JourneySection />
        </section>
      </div>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
