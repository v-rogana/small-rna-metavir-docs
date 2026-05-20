'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CHATBOT_SYSTEM_PROMPT } from '@/data/chatbotPrompt';
import { cn } from '@/lib/cn';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

const ENV_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '';
const STORAGE_KEY = 'metavir-chat-history-v1';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [keyInput, setKeyInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ENV_KEY && ENV_KEY.length > 10 && !ENV_KEY.startsWith('__')) {
      setApiKey(ENV_KEY);
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || !apiKey || loading) return;
    setError(null);
    setInput('');
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 1500,
          temperature: 0.4,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message ?? `API error ${res.status}`);
      }
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? '(empty response)';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-viridis-primary text-cream-50 shadow-glow-lg hover:bg-accent-hover transition"
            aria-label="Open AI assistant"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-50 flex h-[640px] max-h-[calc(100vh-32px)] w-[420px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 text-cream-100 shadow-glow-lg"
            role="dialog"
            aria-label="AI assistant"
          >
            <header className="flex items-center justify-between border-b border-ink-700 bg-ink-700/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent-bright" />
                <span className="font-serif text-base">sRNA MetaVir Assistant</span>
              </div>
              <button
                className="rounded-md p-1 text-cream-200/70 hover:text-cream-50"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div ref={msgsRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <div className="rounded-lg border border-viridis-sun/30 bg-viridis-sun/5 px-3 py-2 text-xs text-viridis-sun">
                Uses OpenAI gpt-4o-mini. Your key stays in memory only, never stored or sent
                anywhere except OpenAI.
              </div>
              {messages.length === 0 && (
                <div className="rounded-xl bg-ink-700/40 px-3 py-2.5 text-sm text-cream-200/90">
                  Hi! Ask me about the small RNA MetaVir pipeline: biology, installation,
                  parameters, or troubleshooting.
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'ml-auto bg-accent text-cream-50'
                      : 'bg-ink-700/40 text-cream-100',
                  )}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:bg-ink-900/80 prose-pre:border prose-pre:border-ink-700 prose-code:text-accent-bright">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-xs italic text-cream-200/60">Thinking…</div>
              )}
              {error && (
                <div className="rounded-md border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-xs text-terracotta">
                  {error}
                </div>
              )}
            </div>

            {!apiKey ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (keyInput.trim().length > 10) setApiKey(keyInput.trim());
                }}
                className="flex gap-2 border-t border-ink-700 bg-ink-700/30 p-3"
              >
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="sk-… (OpenAI API key)"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-200/40 focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-cream-50 hover:bg-accent-bright hover:text-ink-900 transition"
                >
                  Connect
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2 border-t border-ink-700 bg-ink-700/30 p-3"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder="Ask about the pipeline…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="flex-1 resize-none rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-200/40 focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-cream-50 hover:bg-accent-bright hover:text-ink-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            )}
            <p className="border-t border-ink-700 bg-ink-900 px-4 py-2 text-[0.68rem] text-cream-200/50">
              API key is exposed client-side; rate limits apply.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
