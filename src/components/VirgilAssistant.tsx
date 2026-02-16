'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { portfolioInfo } from '@/lib/portfolio-context';

export function VirgilAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      const timer = setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 50); // Delay for DOM update
      return () => clearTimeout(timer);
    }
  }, [chat, loading]);

  // Track when Virgil assistant is opened
  useEffect(() => {
    if (isOpen) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'virgil_opened' }),
      }).catch(() => {});
    }
  }, [isOpen]);

  async function handleSend() {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          portfolioInfo,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setChat((prev) => [...prev, { role: 'assistant', content: data.reply || '...' }]);

      // Track successful message sent
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'virgil_message_sent' }),
      }).catch(() => {});

    } catch (err) {
      console.error('Virgil error:', err);
      setChat((prev) => [
        ...prev,
        { role: 'assistant', content: "Apologies — I seem to have gotten lost in one of Dante's circles. Could you try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-34 h-34 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#9e8a68]"
          aria-label="Talk to Virgil"
        >
          <img
            src="/Virgil1.png"
            alt="Virgil"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </button>
      </div>

      {/* Chat Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-0"
          >
            <Dialog.Panel className="fixed bottom-6 right-6 w-full max-w-sm h-[40rem] bg-[#2b291b] rounded-2xl border border-[#3F3C2b]/30 shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#3F3C2b]/40 bg-[#3F3C2b]/30">
                <h3 className="flex text-[#a3967f] font-semibold text-lg tracking-tight">
                  <img src="/Virgil1.png" alt="Virgil" className="h-[2em]" />
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#b3a081] hover:text-[#a3967f] transition-colors"
                >
                  <XMarkIcon className="h-7 w-7" />
                </button>
              </div>

              {/* Messages - fixed scroll */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-5 overflow-y-auto space-y-5 bg-gradient-to-b from-[#2b291b] to-[#231f1b] scroll-smooth"
              >
                {chat.length === 0 && (
                  <div className="text-center text-[#a3967f]/70 italic text-sm">
                    Ask me anything about Paolo's work, projects, or background.
                  </div>
                )}

                {chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-[#3F3C2b] text-[#e0d4b7]'
                          : 'bg-[#3F3C2b]/70 text-[#d4c9a8]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#3F3C2b]/60 text-[#a3967f] px-4 py-3 rounded-2xl italic text-sm">
                      Virgil is pondering...
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-[#3F3C2b]/40 bg-[#2b291b]/90">
                <div className="flex gap-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !loading) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask Virgil anything..."
                    className="flex-1 bg-[#231f1b] text-[#d4c9a8] placeholder-[#a3967f]/50 px-4 py-3 rounded-xl border border-[#3F3C2b]/50 focus:outline-none focus:border-[#9e8a68]/70 focus:ring-1 focus:ring-[#9e8a68]/30 transition disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !message.trim()}
                    className="px-5 py-3 bg-[#3F3C2b] text-[#a3967f] rounded-xl hover:bg-[#3F3C2b]/80 disabled:opacity-50 transition shadow-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
