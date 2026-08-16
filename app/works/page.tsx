"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CASE_STUDIES } from "@/lib/nothin-data";

export default function WorksIndexPage() {
  return (
    <div className="bg-white text-black min-h-screen pt-32 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-4xl border-b border-black pb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-black/50">
            ( SELECTED WORKS )
          </div>
          <h1 className="font-heavy-grotesk text-4xl sm:text-6xl md:text-7xl tracking-tight text-black uppercase">
            Works Archive
          </h1>
          <p className="text-sm sm:text-base text-black/70 font-light max-w-xl">
            Brand identities, sensory editorial installations, and generative AI systems created in Paris.
          </p>
        </div>

        {/* Split-Screen 2-Column Work Grid (Left project stacked above right project) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {CASE_STUDIES.map((project, idx) => (
            <Link
              key={project.id}
              href={`/works/${project.slug}`}
              className={`group block space-y-4 ${idx % 2 === 1 ? "md:translate-y-20" : ""}`}
            >
              {/* Typography Above Card: Small caps label + Serif headline */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50 block">
                  {project.capsLabel}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial-serif text-3xl sm:text-4xl text-black group-hover:underline">
                    {project.title}
                  </h3>
                  <span className="text-xs font-bold uppercase text-black/50">
                    ( {project.number} )
                  </span>
                </div>
              </div>

              {/* Full-Bleed Image with Individual Saturated Color Grade */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-black">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Project Color Tone */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.colorGrade} opacity-20 group-hover:opacity-35 transition-opacity mix-blend-multiply`} />
              </div>

              {/* One-Liner Description Beneath Card */}
              <p className="text-sm text-black/80 font-light italic pt-1">
                &ldquo;{project.oneLiner}&rdquo;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
