"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage, GLOBAL_LANGUAGES, LanguageCode } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Globe2,
  Globe,
  ChevronDown,
  Flame,
  Copy,
  Check,
  Loader2,
  Info,
  Terminal,
  ExternalLink
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    icon: Compass,
    title: "Platform Walkthrough",
    prompt: "Can you give me a complete walkthrough of the V0ICE platform and how the 5-role response protocol works?",
  },
  {
    icon: ShieldCheck,
    title: "UNESCO MIL Framework",
    prompt: "What is UNESCO's Media and Information Literacy (MIL) framework and why is pre-bunking more effective than reactive fact-checking?",
  },
  {
    icon: Globe2,
    title: "Geopolitics & Disinformation",
    prompt: "How are synthetic media and generative AI deepfakes weaponized in modern geopolitical conflicts and elections?",
  },
  {
    icon: Flame,
    title: "Outbreak Radar & Vaccines",
    prompt: "How does the Outbreak Radar measure regional herd immunity, and how do Vaccine Makers synthesize explainers?",
  },
];

export function DomiChat() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentLangObj = GLOBAL_LANGUAGES.find((l) => l.code === language) || GLOBAL_LANGUAGES[0];

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    setLangMenuOpen(false);
    const target = GLOBAL_LANGUAGES.find((l) => l.code === code);
    const nativeName = target?.native || code;

    setMessages((prev) => [
      ...prev,
      {
        id: `domi-lang-${Date.now()}`,
        role: "assistant",
        content: `🌐 **Language set to ${target?.label} (${nativeName})**\nD0MI is now ready to converse in **${nativeName}**. Feel free to ask any query!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      role: "assistant",
      content:
        "### Greetings! I am D0MI\nYour autonomous intelligence guide for **V0ICE — The MIL Immune System** (UNESCO Youth Hackathon 2026).\n\nI can assist you with:\n- 🧭 **Platform Navigation & Live Walkthroughs**: Guides to [Spotter](/submit), [Analyst](/analyst), [Vaccine Lab](/vaccine), [Field Deployment](/distribute), and the [Outbreak Radar](/map)\n- 🛡️ **UNESCO & United Nations MIL Frameworks**: 5 Laws of MIL, global digital resilience, and pre-bunking strategies\n- 🌐 **Geopolitical Information Warfare**: Detection of generative deepfakes, cloned voice notes, and coordinate disinformation\n- 🔬 **Forensic Analysis**: Cryptographic provenance (C2PA) and public-health epidemiology applied to viral rumors\n\nHow can I empower your surveillance or analysis today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to toggle D0MI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/domi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          userLanguage: language,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: `domi-${Date.now()}`,
        role: "assistant",
        content: data.content || "I am processing your query. Please ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("D0MI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `domi-err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ I encountered a temporary connection error. Please check your internet or retry in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `intro-${Date.now()}`,
        role: "assistant",
        content: "Chat history cleared. How can I assist you with **V0ICE**, **UNESCO**, or **geopolitical media analysis**?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* FLOATING TRIGGER PILL / LAUNCHER (Bottom Right)          */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black border border-white/20 dark:border-black/20 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            aria-label="Open D0MI AI Assistant"
          >
            {/* Multi-Accent Subtle Animated Gradient Border */}
            <div className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-r from-violet-500 via-blue-500 via-emerald-500 via-amber-500 to-red-500 opacity-60 group-hover:opacity-100 transition-opacity -z-10 animate-pulse" />

            <div className="relative flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-manrope font-extrabold text-xs tracking-tight">D0MI</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 dark:text-violet-700 uppercase tracking-widest">
                    AI
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center text-[10px] font-mono opacity-50 pl-1 border-l border-white/20 dark:border-black/20">
                ⌘K
              </div>
            </div>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* EXPANDABLE D0MI CONVERSATION MODAL / TERMINAL            */}
      {/* ======================================================== */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 text-black dark:text-white ${
            isExpanded
              ? "inset-4 sm:inset-8 md:inset-12"
              : "bottom-6 right-6 w-[94vw] sm:w-[500px] md:w-[540px] h-[680px] max-h-[88vh]"
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-blue-600 to-emerald-500 p-[1.5px] flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-manrope font-extrabold text-sm tracking-tight text-black dark:text-white">
                    D0MI AI
                  </span>
                  <span className="text-[10px] font-mono font-bold py-0.5 px-2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    GPT-OSS-120B
                  </span>
                </div>
                <p className="text-[10px] text-black/50 dark:text-white/50 font-manrope">
                  UNESCO Youth Hackathon 2026 · Global Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-900 text-black dark:text-white text-[11px] font-manrope font-bold hover:border-violet-500 transition-all cursor-pointer shadow-xs"
                  title="Change AI Chat Language"
                >
                  <Globe className="w-3 h-3 text-violet-500" />
                  <span>{currentLangObj.code}</span>
                  <ChevronDown className={`w-3 h-3 text-black/50 dark:text-white/50 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {langMenuOpen && (
                  <>
                    <div
                      onClick={() => setLangMenuOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <div className="absolute top-full right-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-neutral-950 border border-black/15 dark:border-white/15 shadow-2xl z-50 p-2 space-y-2 text-xs font-manrope">
                      <div className="px-2 pt-1 pb-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                        Select AI Language
                      </div>

                      {/* Primary English */}
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleLanguageChange("EN")}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all ${
                            language === "EN"
                              ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs"
                              : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black/80 dark:text-white/80"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[11px]">EN</span>
                            <span className="text-[10px] opacity-75">English</span>
                          </div>
                          {language === "EN" && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* European Languages */}
                      <div className="space-y-0.5 border-t border-black/5 dark:border-white/5 pt-1.5">
                        <div className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                          European Languages (EUR)
                        </div>
                        {GLOBAL_LANGUAGES.filter((l) => l.code !== "EN" && ["FR","DE","IT","ES","PT","NL","SV","PL","EL","DA","FI","CS","RO","HU","RU"].includes(l.code)).map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all ${
                              language === lang.code
                                ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black/80 dark:text-white/80"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[11px] min-w-[22px]">{lang.code}</span>
                              <span className="text-[10px] opacity-75 truncate max-w-[140px]">{lang.native}</span>
                            </div>
                            {language === lang.code && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>

                      {/* Other World Languages */}
                      <div className="space-y-0.5 border-t border-black/5 dark:border-white/5 pt-1.5">
                        <div className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                          Other World Languages
                        </div>
                        {GLOBAL_LANGUAGES.filter((l) => ["HI","MX","JA","ZH","KO","BR","SW","AR"].includes(l.code)).map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all ${
                              language === lang.code
                                ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black/80 dark:text-white/80"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[11px] min-w-[22px]">{lang.code}</span>
                              <span className="text-[10px] opacity-75 truncate max-w-[140px]">{lang.native}</span>
                            </div>
                            {language === lang.code && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors cursor-pointer hidden sm:inline-flex"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                title="Close D0MI"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-manrope leading-relaxed">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? "items-start w-full" : "items-end"}`}
                >
                  <div
                    className={`max-w-[94%] sm:max-w-[90%] p-4 rounded-2xl relative group ${
                      isAssistant
                        ? "bg-neutral-100 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] text-black/90 dark:text-white/90 rounded-tl-sm shadow-sm w-full"
                        : "bg-black text-white dark:bg-white dark:text-black font-medium rounded-tr-sm shadow-md"
                    }`}
                  >
                    {isAssistant ? (
                      <RichMarkdownRenderer content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}

                    {isAssistant && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-black/40 dark:text-white/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-black/40 dark:text-white/40 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-black/50 dark:text-white/50 text-xs p-3.5 bg-neutral-100 dark:bg-neutral-900 rounded-2xl w-fit border border-black/[0.06] dark:border-white/[0.06] animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                <span>D0MI is synthesizing response with Groq GPT-OSS-120B...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips (Shown when few messages) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2.5 border-t border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-black/30 overflow-x-auto flex items-center gap-2 no-scrollbar">
              {STARTER_PROMPTS.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-[11px] font-manrope font-semibold whitespace-nowrap hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer shadow-sm flex-shrink-0"
                  >
                    <Icon className="w-3 h-3 text-violet-500" />
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Form Bar */}
          <div className="p-3 sm:p-4 border-t border-black/[0.08] dark:border-white/[0.08] bg-neutral-50 dark:bg-black/60 backdrop-blur-md flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-black/15 dark:border-white/15 rounded-2xl px-3.5 py-2 shadow-inner focus-within:border-black/50 dark:focus-within:border-white/50 transition-colors"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Ask D0MI about V0ICE navigation, UNESCO MIL, or geopolitics..."
                className="flex-1 bg-transparent resize-none outline-none text-xs font-manrope text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 max-h-24 overflow-y-auto"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-black/40 dark:text-white/40 pt-2 px-1 font-manrope">
              <span>Press <kbd className="font-mono font-semibold">Enter ↵</kbd> to send</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Groq 120B Active</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// RICH MARKDOWN RENDERER
// Handles: Headings (#, ##, ###), Tables (| ... |), Numbered Lists (1. ...),
// Bullet Lists (- ...), Code Blocks (``` ... ```), Blockquotes (> ...),
// Inline Code (` ... `), Horizontal Rules (---), Bold (**...**), and Links
// ============================================================================
function RichMarkdownRenderer({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3 rich-markdown text-black/90 dark:text-white/90">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 1) {
              return (
                <h1 key={idx} className="font-manrope text-base font-extrabold text-black dark:text-white border-b border-black/10 dark:border-white/10 pb-1.5 mt-2 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-violet-500 rounded-full" />
                  <span>{renderInlineTokens(block.text)}</span>
                </h1>
              );
            }
            if (block.level === 2) {
              return (
                <h2 key={idx} className="font-manrope text-sm font-extrabold text-black dark:text-white mt-2.5 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-500 rounded-full" />
                  <span>{renderInlineTokens(block.text)}</span>
                </h2>
              );
            }
            return (
              <h3 key={idx} className="font-manrope text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mt-2 mb-0.5 flex items-center gap-1.5">
                <span>✦</span>
                <span>{renderInlineTokens(block.text)}</span>
              </h3>
            );
          }

          case "table": {
            return (
              <div key={idx} className="my-2.5 overflow-x-auto rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 shadow-sm">
                <table className="w-full text-left text-[11px] font-manrope border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-black/10 dark:border-white/10 text-black dark:text-white">
                      {block.headers.map((h, hIdx) => (
                        <th key={hIdx} className="py-2 px-3 font-extrabold uppercase tracking-wider">
                          {renderInlineTokens(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 text-black/80 dark:text-white/80 align-top">
                            {renderInlineTokens(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "code": {
            return (
              <div key={idx} className="my-2.5 rounded-xl overflow-hidden border border-black/15 dark:border-white/15 bg-neutral-900 text-neutral-100 font-mono text-[11px]">
                <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950 border-b border-white/10 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-violet-400" />
                    <span>{block.language || "code"}</span>
                  </div>
                </div>
                <pre className="p-3 overflow-x-auto leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          }

          case "blockquote": {
            return (
              <div key={idx} className="my-2 p-3 rounded-xl bg-violet-500/10 border-l-2 border-violet-500 text-black/80 dark:text-white/80 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  {renderInlineTokens(block.text)}
                </div>
              </div>
            );
          }

          case "hr": {
            return <hr key={idx} className="my-3 border-t border-black/10 dark:border-white/10" />;
          }

          case "list": {
            return (
              <div key={idx} className="space-y-1 my-1.5 pl-1">
                {block.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-start gap-2.5">
                    {block.ordered ? (
                      <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-black dark:text-white">
                        {iIdx + 1}
                      </span>
                    ) : (
                      <span className="text-violet-500 font-bold text-sm leading-none mt-1 flex-shrink-0">•</span>
                    )}
                    <div className="flex-1 leading-relaxed">{renderInlineTokens(item)}</div>
                  </div>
                ))}
              </div>
            );
          }

          case "paragraph":
          default: {
            return (
              <p key={idx} className="leading-relaxed mb-1.5 last:mb-0">
                {renderInlineTokens(block.text)}
              </p>
            );
          }
        }
      })}
    </div>
  );
}

// Markdown Block Parser
type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; code: string; language: string }
  | { type: "blockquote"; text: string }
  | { type: "hr" }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block ```
    if (trimmed.startsWith("```")) {
      const language = trimmed.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      blocks.push({ type: "code", code: codeLines.join("\n"), language });
      continue;
    }

    // 2. Horizontal Rule --- or ***
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 3. Headings #, ##, ###
    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: "heading",
          level: match[1].length,
          text: match[2],
        });
        i++;
        continue;
      }
    }

    // 4. Blockquotes >
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // 5. Tables | Header | Header |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (r: string) =>
          r
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        // Row 1 is divider |---|---|
        const rows = tableLines.slice(2).map(parseRow);
        blocks.push({ type: "table", headers, rows });
        continue;
      }
    }

    // 6. Ordered / Unordered Lists
    const isOrderedItem = /^\d+\.\s+/.test(trimmed);
    const isUnorderedItem = /^[-*•]\s+/.test(trimmed);

    if (isOrderedItem || isUnorderedItem) {
      const ordered = isOrderedItem;
      const items: string[] = [];

      while (i < lines.length) {
        const currentTrim = lines[i].trim();
        const matchesOrdered = /^\d+\.\s+(.*)$/.exec(currentTrim);
        const matchesUnordered = /^[-*•]\s+(.*)$/.exec(currentTrim);

        if (ordered && matchesOrdered) {
          items.push(matchesOrdered[1]);
          i++;
        } else if (!ordered && matchesUnordered) {
          items.push(matchesUnordered[1]);
          i++;
        } else if (currentTrim === "") {
          i++;
          break;
        } else {
          break;
        }
      }

      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // 7. Regular Paragraph (skip blank lines)
    if (trimmed === "") {
      i++;
      continue;
    }

    // Accumulate consecutive text lines into one paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      lines[i].trim() !== "---" &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

// Inline token parser for Bold, Italics, Code, and Clickable Links
function renderInlineTokens(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Match: `inline code`, **bold**, *italic*, [Link](url)
  const regex = /(`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    if (match[2]) {
      // Inline code `...`
      tokens.push(
        <code
          key={match.index}
          className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-violet-600 dark:text-violet-300 font-semibold"
        >
          {match[2]}
        </code>
      );
    } else if (match[3]) {
      // Bold **...**
      tokens.push(
        <strong key={match.index} className="font-bold text-black dark:text-white">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      // Italic *...*
      tokens.push(
        <em key={match.index} className="italic text-black/80 dark:text-white/80">
          {match[4]}
        </em>
      );
    } else if (match[5] && match[6]) {
      // Markdown link [Text](URL)
      const linkText = match[5];
      const linkUrl = match[6];
      const isInternal = linkUrl.startsWith("/");

      if (isInternal) {
        tokens.push(
          <Link
            key={match.index}
            href={linkUrl}
            className="inline-flex items-center gap-1 font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline px-1.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 transition-all cursor-pointer shadow-xs my-0.5"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-2.5 h-2.5 inline" />
          </Link>
        );
      } else {
        tokens.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 transition-all"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens;
}
