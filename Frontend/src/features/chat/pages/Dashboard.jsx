import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import gsap from "gsap";
import {
  Search,
  Plus,
  MessageSquare,
  Settings,
  Zap,
  ChevronDown,
  Check,
  ArrowUp,
  Sparkles,
  User,
  Compass,
  Library,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

/**
 * GSAP is the animation engine for this whole screen.
 * Install it in your project first:
 *   npm install gsap
 *
 * Responsive strategy:
 *  - Sidebar is a static column on lg+ screens, and an off-canvas drawer
 *    below lg (toggled by a hamburger button + backdrop). The slide is a
 *    plain CSS transform/transition so it never fights the lg:translate-x-0
 *    override; GSAP is reserved for opacity/stagger, not position, on the
 *    sidebar shell.
 *  - Hero heading, message bubbles, and input chrome use fluid Tailwind
 *    breakpoints (text sizes, max-widths, paddings) rather than fixed px.
 *  - Selecting a chat or starting a new thread auto-closes the drawer on
 *    mobile so you're not stuck looking at the sidebar after navigating.
 */

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
  .font-display { font-family: 'Space Grotesk', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes shimmer-sweep {
    0% { background-position: -150% 0; }
    100% { background-position: 250% 0; }
  }
  .shimmer-btn {
    background-image: linear-gradient(
      110deg,
      rgba(34,211,238,0.15) 0%,
      rgba(139,92,246,0.35) 45%,
      rgba(34,211,238,0.15) 90%
    );
    background-size: 250% 100%;
    animation: shimmer-sweep 3.5s linear infinite;
  }
`;

const MODELS = [
  { id: "precision", label: "Precision", sub: "Best for deep synthesis" },
  { id: "fast", label: "Fast Draft", sub: "Speed-optimized" },
];

const INITIAL_CHATS = [
  { id: 1, title: "Refactor auth middleware", time: "2 min ago" },
  { id: 2, title: "Design token system", time: "1 hr ago" },
  { id: 3, title: "Debug websocket memory leak", time: "Yesterday" },
];

/* ---------------------------------------------------------- */
/* Model picker with GSAP-driven open/close                    */
/* ---------------------------------------------------------- */

function ModelPicker({ model, setModel }) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false); // keeps panel mounted during close tween
  const panelRef = useRef(null);
  const chevronRef = useRef(null);
  const btnRef = useRef(null);
  const active = MODELS.find((m) => m.id === model);

  useEffect(() => {
    gsap.to(chevronRef.current, {
      rotate: open ? 180 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    if (open) {
      setRendered(true);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!rendered) return;
    const panel = panelRef.current;
    if (!panel) return;

    if (open) {
      const items = panel.querySelectorAll("[data-model-item]");
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 10, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.7)" }
      );
      gsap.fromTo(
        items,
        { autoAlpha: 0, x: -8 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.22,
          stagger: 0.06,
          delay: 0.08,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(panel, {
        autoAlpha: 0,
        y: 8,
        scale: 0.96,
        duration: 0.18,
        ease: "power1.in",
        onComplete: () => setRendered(false),
      });
    }
  }, [open, rendered]);

  const pulseButton = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
    );
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => {
          setOpen((o) => !o);
          pulseButton();
        }}
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: "power2.out" })
        }
        onMouseLeave={(e) =>
          gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" })
        }
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 sm:px-2.5"
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
        <span className="hidden xs:inline sm:inline">{active.label}</span>
        <ChevronDown ref={chevronRef} className="h-3.5 w-3.5 shrink-0 text-slate-500" />
      </button>

      {rendered && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className="absolute bottom-full left-0 z-20 mb-2 w-64 max-w-[80vw] overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl sm:w-56"
            style={{ visibility: "hidden" }}
          >
            {MODELS.map((m) => (
              <button
                key={m.id}
                data-model-item
                onClick={() => {
                  setModel(m.id);
                  setOpen(false);
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    backgroundColor: "rgba(255,255,255,0.06)",
                    x: 4,
                    duration: 0.18,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    backgroundColor: "rgba(255,255,255,0)",
                    x: 0,
                    duration: 0.18,
                  })
                }
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <div>
                  <p className="text-sm text-slate-100">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.sub}</p>
                </div>
                {model === m.id && <Check className="h-4 w-4 shrink-0 text-cyan-300" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Animated send button: hover scale, click squash, idle pulse */
/* ---------------------------------------------------------- */

function SendButton({ onClick, disabled }) {
  const btnRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    gsap.to(ring, {
      scale: 1.6,
      autoAlpha: 0,
      duration: 1.4,
      repeat: -1,
      ease: "power1.out",
    });
  }, []);

  const handleClick = () => {
    if (disabled) return;
    gsap
      .timeline()
      .to(btnRef.current, { scale: 0.82, duration: 0.09, ease: "power2.in" })
      .to(btnRef.current, { scale: 1.12, duration: 0.16, ease: "power2.out" })
      .to(btnRef.current, { scale: 1, duration: 0.14, ease: "power2.out" });
    onClick();
  };

  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-8 sm:w-8">
      <span
        ref={ringRef}
        className="pointer-events-none absolute inset-0 rounded-lg bg-cyan-400/40"
      />
      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2, ease: "power2.out" })
        }
        onMouseLeave={(e) =>
          gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" })
        }
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 hover:bg-slate-200"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Typing indicator: three dots looping                        */
/* ---------------------------------------------------------- */

function TypingIndicator() {
  const dotsRef = useRef([]);
  dotsRef.current = [];

  useEffect(() => {
    gsap.to(dotsRef.current, {
      y: -5,
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="flex items-start gap-2.5 sm:gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
        <Zap className="h-3.5 w-3.5 text-slate-950" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => el && dotsRef.current.push(el)}
            className="h-1.5 w-1.5 rounded-full bg-slate-400"
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Message bubble: animates itself in on first mount           */
/* ---------------------------------------------------------- */

function MessageBubble({ role, content }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const fromX = role === "user" ? 24 : -24;
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, x: fromX, y: 10, scale: 0.94 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }
    );
  }, [role]);

  if (role === "assistant") {
    return (
      <div ref={ref} className="flex items-start gap-2.5 sm:gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
          <Zap className="h-3.5 w-3.5 text-slate-950" strokeWidth={2.5} />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 sm:max-w-md md:max-w-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex items-start justify-end gap-2.5 sm:gap-3">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-500 to-violet-600 px-4 py-2.5 text-sm text-white sm:max-w-md md:max-w-lg">
        {content}
      </div>
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
        <User className="h-3.5 w-3.5 text-slate-300" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Main dashboard                                               */
/* ---------------------------------------------------------- */

export default function ChatDashboard() {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);

  const [chats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(1);
  const [model, setModel] = useState("precision");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sidebarRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const historyRef = useRef(null);
  const footerRef = useRef(null);
  const heroRef = useRef(null);
  const heroInputRef = useRef(null);
  const activePillRef = useRef(null);
  const historyItemRefs = useRef({});
  const overlayRef = useRef(null);
  const hamburgerIconRef = useRef(null);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  /* -------- Mount timeline: sidebar contents fade/stagger in --------
     NOTE: no x-transform on the sidebar shell itself here, since the
     drawer's open/close position is fully owned by CSS translate
     classes below (so GSAP and the responsive drawer never fight). */
  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(sidebarRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
      .fromTo(
        logoRef.current,
        { scale: 0.4, rotate: -25, autoAlpha: 0 },
        { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.25"
      )
      .fromTo(
        navRef.current?.children || [],
        { x: -16, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06 },
        "-=0.2"
      )
      .fromTo(
        historyRef.current?.children || [],
        { x: -16, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.35, stagger: 0.07 },
        "-=0.15"
      )
      .fromTo(
        footerRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        "-=0.1"
      );

    return () => tl.kill();
  }, []);

  /* -------- Hero entrance (empty state only) -------- */
  useLayoutEffect(() => {
    if (messages.length > 0 || !heroRef.current) return;

    const words = heroRef.current.querySelectorAll("[data-word]");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      words,
      { y: 30, autoAlpha: 0, rotateX: -40 },
      { y: 0, autoAlpha: 1, rotateX: 0, duration: 0.55, stagger: 0.05 }
    ).fromTo(
      heroInputRef.current,
      { y: 24, autoAlpha: 0, scale: 0.94 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" },
      "-=0.25"
    );

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length === 0]);

  /* -------- Active chat sliding pill -------- */
  useLayoutEffect(() => {
    const target = historyItemRefs.current[activeChat];
    if (!target || !activePillRef.current) return;
    const parentRect = target.parentElement.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    gsap.to(activePillRef.current, {
      y: rect.top - parentRect.top,
      height: rect.height,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [activeChat, chats, sidebarOpen]);

  /* -------- Smooth GSAP auto-scroll on new messages -------- */
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    gsap.to(el, {
      scrollTop: el.scrollHeight,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [messages, isTyping]);

  /* -------- Mobile drawer: backdrop fade + hamburger morph -------- */
  useEffect(() => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        autoAlpha: sidebarOpen ? 1 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
    if (hamburgerIconRef.current) {
      gsap.to(hamburgerIconRef.current, {
        rotate: sidebarOpen ? 90 : 0,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }
  }, [sidebarOpen]);

  const closeSidebarOnMobile = () => setSidebarOpen(false);

  const send = () => {
    if (!query.trim()) return;
    const userMsg = { role: "user", content: query };
    setMessages((m) => [...m, userMsg]);
    setQuery("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Got it — here's how I'd approach that. Let me know if you want me to go deeper on any part.",
        },
      ]);
    }, 900);
  };

  const hasStarted = messages.length > 0;

  const navHover = (e, active) =>
    gsap.to(e.currentTarget, {
      x: active ? 4 : 0,
      duration: 0.22,
      ease: "power2.out",
    });

  const iconNudge = (iconEl, active) =>
    gsap.to(iconEl, {
      scale: active ? 1.15 : 1,
      rotate: active ? -8 : 0,
      duration: 0.25,
      ease: "back.out(2)",
    });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-body">
      <style>{FONT_IMPORT}</style>

      {/* Mobile backdrop */}
      <div
        ref={overlayRef}
        onClick={closeSidebarOnMobile}
        style={{ visibility: sidebarOpen ? "visible" : "hidden", opacity: 0 }}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
      />

      {/* Sidebar: static column on lg+, off-canvas drawer below lg */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-white/5 bg-slate-950 px-4 py-6 transition-transform duration-300 ease-out
        lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo + name + mobile close button */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div
              ref={logoRef}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500"
            >
              <Zap className="h-4.5 w-4.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight tracking-tight">
                Nexus
              </p>
              <p className="text-xs text-slate-500">Pro Plan</p>
            </div>
          </div>
          <button
            onClick={closeSidebarOnMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav ref={navRef} className="mb-3 space-y-1">
          <button
            onMouseEnter={(e) => {
              navHover(e, true);
              iconNudge(e.currentTarget.querySelector("svg"), true);
            }}
            onMouseLeave={(e) => {
              navHover(e, false);
              iconNudge(e.currentTarget.querySelector("svg"), false);
            }}
            className="flex w-full items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            Threads
          </button>
          <button
            onMouseEnter={(e) => {
              navHover(e, true);
              iconNudge(e.currentTarget.querySelector("svg"), true);
            }}
            onMouseLeave={(e) => {
              navHover(e, false);
              iconNudge(e.currentTarget.querySelector("svg"), false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <Compass className="h-4 w-4" strokeWidth={2} />
            Discover
          </button>
          <button
            onMouseEnter={(e) => {
              navHover(e, true);
              iconNudge(e.currentTarget.querySelector("svg"), true);
            }}
            onMouseLeave={(e) => {
              navHover(e, false);
              iconNudge(e.currentTarget.querySelector("svg"), false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <Library className="h-4 w-4" strokeWidth={2} />
            Library
          </button>
          <button
            onClick={(e) => {
              gsap
                .timeline()
                .to(e.currentTarget.querySelector("svg"), {
                  rotate: 180,
                  duration: 0.3,
                  ease: "back.out(2)",
                })
                .to(e.currentTarget.querySelector("svg"), {
                  rotate: 0,
                  duration: 0.01,
                });
              setMessages([]);
              setActiveChat(null);
              closeSidebarOnMobile();
            }}
            onMouseEnter={(e) => {
              navHover(e, true);
              iconNudge(e.currentTarget.querySelector("svg"), true);
            }}
            onMouseLeave={(e) => {
              navHover(e, false);
              iconNudge(e.currentTarget.querySelector("svg"), false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Thread
          </button>
        </nav>

        {/* Chat history */}
        <p className="mb-2 px-3 text-xs uppercase tracking-wider text-slate-500">Recent</p>
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <span
            ref={activePillRef}
            className="pointer-events-none absolute left-0 w-full rounded-lg bg-white/5"
            style={{ visibility: "hidden" }}
          />
          <div ref={historyRef} className="relative space-y-1">
            {chats.map((c) => (
              <button
                key={c.id}
                ref={(el) => (historyItemRefs.current[c.id] = el)}
                onClick={() => {
                  setActiveChat(c.id);
                  closeSidebarOnMobile();
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, { x: 4, duration: 0.2, ease: "power2.out" })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, { x: 0, duration: 0.2, ease: "power2.out" })
                }
                className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm ${
                  activeChat === c.id ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upgrade promo */}
        <button
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2, ease: "power2.out" })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" })
          }
          className="shimmer-btn mt-4 rounded-lg border border-white/10 px-3 py-2.5 text-left text-sm font-medium text-slate-100"
        >
          Upgrade to Pro
        </button>

        {/* Bottom links */}
        <div className="mt-3 space-y-1 border-t border-white/5 pt-3">
          <button
            onMouseEnter={(e) => navHover(e, true)}
            onMouseLeave={(e) => navHover(e, false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onMouseEnter={(e) => navHover(e, true)}
            onMouseLeave={(e) => navHover(e, false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
        </div>

        {/* Logged-in user */}
        <div
          ref={footerRef}
          className="mt-3 flex items-center gap-2.5 border-t border-white/5 px-2 pt-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
            <User className="h-4 w-4 text-slate-300" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-100">{user?.username ?? "Loading..."}</p>
            <p className="truncate text-xs text-slate-500">{user?.email ?? ""}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar: hamburger + current title, hidden on lg+ */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5"
          >
            <Menu ref={hamburgerIconRef} className="h-5 w-5" />
          </button>
          <span className="truncate font-display text-sm font-medium text-slate-200">
            {hasStarted ? chats.find((c) => c.id === activeChat)?.title ?? "New chat" : "Nexus"}
          </span>
        </div>

        {!hasStarted ? (
          /* Empty state: centered hero + input */
          <div
            ref={heroRef}
            className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6"
          >
            <h1 className="text-center font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {"What are we building?".split(" ").map((w, i) => (
                <span key={i} data-word className="mr-2 inline-block sm:mr-3">
                  {w}
                </span>
              ))}
            </h1>
            <p className="mt-3 text-center text-sm text-slate-400">
              Start a conversation to get going.
            </p>

            <div
              ref={heroInputRef}
              className="mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-2.5 backdrop-blur sm:p-3"
            >
              <div className="flex items-center gap-2 px-1">
                <Search className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  onFocus={(e) =>
                    gsap.to(e.currentTarget.parentElement.parentElement, {
                      boxShadow: "0 0 0 2px rgba(34,211,238,0.4)",
                      duration: 0.25,
                    })
                  }
                  onBlur={(e) =>
                    gsap.to(e.currentTarget.parentElement.parentElement, {
                      boxShadow: "0 0 0 0px rgba(34,211,238,0)",
                      duration: 0.25,
                    })
                  }
                  placeholder="Ask anything..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <ModelPicker model={model} setModel={setModel} />
                <SendButton onClick={send} disabled={!query.trim()} />
              </div>
            </div>
          </div>
        ) : (
          /* Active chat: messages + bottom-pinned input */
          <>
            {/* Desktop chat header (mobile uses the top bar above) */}
            <div className="hidden items-center justify-between border-b border-white/5 px-6 py-4 lg:flex">
              <span className="font-display text-sm font-medium text-slate-200">
                {chats.find((c) => c.id === activeChat)?.title ?? "New chat"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-400">
                {MODELS.find((m) => m.id === model)?.label}
              </span>
            </div>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
              <div className="mx-auto flex max-w-2xl flex-col gap-5 sm:gap-6">
                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t border-white/5 px-4 py-3 sm:px-6 sm:py-4">
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-2.5 backdrop-blur sm:p-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  onFocus={(e) =>
                    gsap.to(e.currentTarget.parentElement, {
                      boxShadow: "0 0 0 2px rgba(34,211,238,0.4)",
                      duration: 0.25,
                    })
                  }
                  onBlur={(e) =>
                    gsap.to(e.currentTarget.parentElement, {
                      boxShadow: "0 0 0 0px rgba(34,211,238,0)",
                      duration: 0.25,
                    })
                  }
                  placeholder="Message Nexus..."
                  className="w-full min-w-0 bg-transparent px-1 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between px-1">
                  <ModelPicker model={model} setModel={setModel} />
                  <SendButton onClick={send} disabled={!query.trim()} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}