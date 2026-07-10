import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
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
} from "lucide-react";

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
  .font-display { font-family: 'Space Grotesk', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
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

function ModelPicker({ model, setModel }) {
  const [open, setOpen] = useState(false);
  const active = MODELS.find((m) => m.id === model);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10"
      >
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        {active.label}
        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-20 mb-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setModel(m.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-white/5"
              >
                <div>
                  <p className="text-sm text-slate-100">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.sub}</p>
                </div>
                {model === m.id && <Check className="h-4 w-4 text-cyan-300" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ChatDashboard() {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);

  const [chats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(1);
  const [model, setModel] = useState("precision");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!query.trim()) return;
    const userMsg = { role: "user", content: query };
    setMessages((m) => [...m, userMsg]);
    setQuery("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Got it — here's how I'd approach that. Let me know if you want me to go deeper on any part.",
        },
      ]);
    }, 700);
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-body">
      <style>{FONT_IMPORT}</style>

      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 px-4 py-6">
        {/* Logo + name */}
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
            <Zap className="h-4.5 w-4.5 text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight tracking-tight">
              Nexus
            </p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mb-3 space-y-1">
          <button
            className="flex w-full items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            Threads
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <Compass className="h-4 w-4" strokeWidth={2} />
            Discover
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <Library className="h-4 w-4" strokeWidth={2} />
            Library
          </button>
          <button
            onClick={() => {
              setMessages([]);
              setActiveChat(null);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Thread
          </button>
        </nav>

        {/* Chat history */}
        <p className="mb-2 px-3 text-xs uppercase tracking-wider text-slate-500">Recent</p>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeChat === c.id
                  ? "bg-white/5 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>

        {/* Upgrade promo */}
        <button className="mt-4 rounded-lg border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 px-3 py-2.5 text-left text-sm font-medium text-slate-100 hover:from-cyan-500/20 hover:to-violet-500/20">
          Upgrade to Pro
        </button>

        {/* Bottom links */}
        <div className="mt-3 space-y-1 border-t border-white/5 pt-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
        </div>

        {/* Logged-in user */}
        <div className="mt-3 flex items-center gap-2.5 border-t border-white/5 px-2 pt-3">
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
        {!hasStarted ? (
          /* Empty state: centered hero + input */
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              What are we building?
            </h1>
            <p className="mt-3 text-sm text-slate-400">Start a conversation to get going.</p>

            <div className="mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <div className="flex items-center gap-2 px-1">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <ModelPicker model={model} setModel={setModel} />
                <button
                  onClick={send}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 hover:bg-slate-200"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active chat: messages + bottom-pinned input */
          <>
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <span className="font-display text-sm font-medium text-slate-200">
                {chats.find((c) => c.id === activeChat)?.title ?? "New chat"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-400">
                {MODELS.find((m) => m.id === model)?.label}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="mx-auto flex max-w-2xl flex-col gap-6">
                {messages.map((m, i) =>
                  m.role === "assistant" ? (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
                        <Zap className="h-3.5 w-3.5 text-slate-950" strokeWidth={2.5} />
                      </div>
                      <div className="max-w-lg rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-start justify-end gap-3">
                      <div className="max-w-lg rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-500 to-violet-600 px-4 py-2.5 text-sm text-white">
                        {m.content}
                      </div>
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <User className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t border-white/5 px-6 py-4">
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Message Nexus..."
                  className="w-full bg-transparent px-1 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between px-1">
                  <ModelPicker model={model} setModel={setModel} />
                  <button
                    onClick={send}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 hover:bg-slate-200"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}