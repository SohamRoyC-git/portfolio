"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { SiteNavigation } from "@/components/SiteNavigation";
import { JourneyPath } from "@/components/JourneyPath";
import { HeroScene } from "@/components/HeroScene";
import { JourneyIntro } from "@/components/JourneyIntro";
import { ExperienceStory } from "@/components/ExperienceStory";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SkillsSection } from "@/components/SkillsSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Section observer for navigation spy
  useEffect(() => {
    const sectionIds = ["hero", "journey", "experience", "work", "skills", "education", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToJourney = () => {
    const el = document.getElementById("journey");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#202124] selection:bg-[#F97316]/20 selection:text-[#EA580C]">
      {/* Editorial Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation & Progress Line */}
      <SiteNavigation activeSection={activeSection} />
      <JourneyPath />

      {/* Narrative Scenes */}
      <main>
        {/* Scene A: Introduction */}
        <HeroScene
          onExploreClick={scrollToJourney}
          onContactClick={scrollToContact}
        />

        {/* Scene B: The Journey Begins */}
        <JourneyIntro />

        {/* Scene C: International Experience */}
        <ExperienceStory />

        {/* Scene D: Featured Work & Case Studies */}
        <ProjectShowcase />

        {/* Scene E: The Developer's Toolkit */}
        <SkillsSection />

        {/* Scene F: Education & Direction */}
        <EducationSection onContactClick={scrollToContact} />

        {/* Scene G: Destination / Contact */}
        <ContactSection />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
