"use client";

import { Instagram, Activity, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { useTranslation } from "./TranslationProvider";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <Reveal delay={0.5}>
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {t("cta.title")}
            </h2>
            <p className="text-white/90 text-lg">
              {t("cta.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://instagram.com/joaofaquino"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-6 h-6" />
              <span>@joaofaquino</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://www.strava.com/athletes/joaoaquino"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              <span>Strava</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Subtitle */}
          <p className="text-white/80 text-sm italic">
            &ldquo;{t("journey.quote")}&rdquo; 🏃‍♂️
          </p>
        </div>
      </div>
    </Reveal>
  );
}
