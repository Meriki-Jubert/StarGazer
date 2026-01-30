"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

export default function AiChat({ story }: { story?: string }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Got any theories you wanna chat about?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], story }),
      });

      if (!res.ok || !res.body) throw new Error('no-stream');

      const decoder = new TextDecoder();
      const reader = res.body.getReader();
      let aiContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: aiContent };
          return next;
        });
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "That's exactly what I was thinking! It has to be the Void Walkers, right? The clean cut on the hull is their signature. What do you think Kaelen should do?" 
      }]);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full font-sans text-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-purple-600' : 'bg-blue-600'}`}>
              {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] ${m.role === 'assistant' ? 'bg-purple-900/40 text-purple-100 rounded-tl-none' : 'bg-blue-900/40 text-blue-100 rounded-tr-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      
      <div className="p-4 border-t border-white/10 bg-black/40">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your theory..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
          />
          <button type="submit" className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
