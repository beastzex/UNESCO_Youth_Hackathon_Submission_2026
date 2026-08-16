"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { CASE_STUDIES } from "@/lib/nothin-data";

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const project = CASE_STUDIES.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="font-heavy-grotesk text-4xl uppercase">Case Study Not Found</h1>
        <Link
          href="/works"
          className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase"
        >
          Return to Works
        </Link>
      </div>
    );
  }

  // Next Project
  const currentIndex = CASE_STUDIES.findIndex((p) => p.slug === slug);
  const nextProject = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length];

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 selection:bg-black selection:text-white">
      {/* ========================================================================= */}
      {/* SIGNATURE CASE-STUDY OPENING SCREEN */}
      {/* Pattern: Small serif wordmark top-left of image, pull-quote bottom-left, index (02) + section label (Impulsion) bottom area */}
      {/* ========================================================================= */}
      <section className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12 pb-16">
        {/* Full-Bleed Opening Canvas */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black shadow-2xl">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />

          {/* Project Color Tone Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${project.colorGrade} opacity-25 mix-blend-multiply`} />

          {/* Top-Left: Small serif project wordmark */}
          <div className="absolute top-6 sm:top-10 left-6 sm:left-10 text-white font-editorial-serif text-2xl sm:text-4xl drop-shadow-lg tracking-wide">
            {project.title}
          </div>

          {/* Bottom Overlay Grid */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-white drop-shadow-md">
            {/* Bottom-Left: One-line pull-quote */}
            <blockquote className="text-lg sm:text-2xl md:text-3xl font-editorial-serif italic max-w-xl leading-tight">
              &ldquo;{project.oneLiner}&rdquo;
            </blockquote>

            {/* Bottom Area: Numbered Index (02) + Section Label (Impulsion) */}
            <div className="text-right text-xs font-bold uppercase tracking-widest bg-black/40 backdrop-blur px-4 py-2 border border-white/30">
              <span className="text-white/60 mr-2">{project.number}</span>
              <span>/ {project.sectionLabel}</span>
            </div>
          </div>
        </div>

        {/* Project Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-black text-xs font-bold uppercase tracking-wider">
          <div>
            <span className="text-black/40 block mb-1">CLIENT</span>
            <span className="text-black font-normal">{project.client}</span>
          </div>
          <div>
            <span className="text-black/40 block mb-1">LOCATION</span>
            <span className="text-black font-normal">{project.location}</span>
          </div>
          <div>
            <span className="text-black/40 block mb-1">YEAR</span>
            <span className="text-black font-normal">{project.year}</span>
          </div>
          <div>
            <span className="text-black/40 block mb-1">CATEGORY</span>
            <span className="text-black font-normal">{project.category}</span>
          </div>
        </div>

        {/* Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-black/50 block">
              ( PERSPECTIVE )
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl text-black leading-tight">
              {project.overview}
            </h2>
            <div className="border-l-2 border-black pl-4 py-2 space-y-2">
              <p className="text-xs font-bold uppercase text-black/60">STATEMENT</p>
              <blockquote className="font-editorial-serif text-lg italic text-black">
                &ldquo;{project.quote.text}&rdquo;
              </blockquote>
              <p className="text-xs text-black/50">— {project.quote.author}</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 text-sm sm:text-base font-light text-black/80 leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black">The Challenge</h3>
              <p>{project.challenge}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black">The Solution</h3>
              <p>{project.solution}</p>
            </div>

            {/* Metrics */}
            {project.metrics && (
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black">
                {project.metrics.map((m, i) => (
                  <div key={i} className="p-4 border border-black text-xs font-bold uppercase tracking-wider">
                    <div className="text-2xl font-heavy-grotesk text-black">{m.value}</div>
                    <div className="text-[10px] text-black/50 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visual Artifacts Gallery */}
        <div className="space-y-6 pt-8 border-t border-black">
          <span className="text-xs font-bold uppercase tracking-widest text-black/50 block">
            ( GALLERY ARTIFACTS )
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.gallery.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                <Image
                  src={img}
                  alt={`${project.title} visual artifact ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Case Study Trigger */}
        <div className="pt-16 border-t border-black">
          <Link
            href={`/works/${nextProject.slug}`}
            className="group block p-8 sm:p-14 bg-black text-white hover:bg-neutral-900 transition-all text-center space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/50 block">
              NEXT CASE STUDY ({nextProject.number})
            </span>
            <h3 className="font-editorial-serif text-4xl sm:text-6xl text-white group-hover:underline">
              {nextProject.title} →
            </h3>
            <p className="text-sm italic font-editorial-serif text-white/70">
              &ldquo;{nextProject.oneLiner}&rdquo;
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
