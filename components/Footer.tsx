import React from "react";
import Link from "next/link";
import { ShieldAlert, Globe2, Sparkles, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span>OUTBREAK: The MIL Immune System</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              A citizen misinformation-surveillance & rapid inoculation platform modeled on epidemiological public health containment.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                <Award className="w-3.5 h-3.5" />
                UNESCO Youth Hackathon 2026
              </span>
              <span className="text-xs text-slate-500 font-mono">Theme: "Play Your Part"</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">5-Stage Response Loop</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/submit" className="hover:text-teal-300 transition-colors">1. Spotter Detection</Link></li>
              <li><Link href="/analyst" className="hover:text-teal-300 transition-colors">2. Genomic Triage</Link></li>
              <li><Link href="/vaccine" className="hover:text-teal-300 transition-colors">3. Vaccine Synthesis</Link></li>
              <li><Link href="/distribute" className="hover:text-teal-300 transition-colors">4. Field Inoculation</Link></li>
              <li><Link href="/map" className="hover:text-teal-300 transition-colors">5. Herd Immunity Map</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Engine & Stack</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>Groq (openai/gpt-oss-120b)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe2 className="w-3 h-3 text-teal-400" />
                <span>Next.js 14 App Router + TS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-teal-400" />
                <span>Supabase PostgreSQL + Vector</span>
              </li>
              <li className="text-slate-500 pt-2 text-[11px]">
                Built for rapid community fact-checking and media resilience.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 OUTBREAK MIL-IS. Open Public Health Framework for Digital Literacy.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Empowering youth to design the future of Media and Information Literacy.</p>
        </div>
      </div>
    </footer>
  );
}
