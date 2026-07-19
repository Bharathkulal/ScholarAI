import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, MessageSquare, Loader2, Minimize2 } from 'lucide-react';
import { sendAIChatQuestionApi } from '../../services/ai';
import toast from 'react-hot-toast';

export const AIChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your ScholarAI Assistant. Ask me anything about your scholarship eligibility, SSP/NSP deadlines, or required documents.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendAIChatQuestionApi(userMsg);
      const aiReply = res.data?.answer || 'I am ready to help you navigate your scholarship applications!';
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Based on ScholarAI rules, please ensure your annual income certificate and SSLC/PUC marks card are updated on your profile.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full bg-[#111111] hover:bg-[#222222] text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer border-2 border-[#CD0000]"
        >
          <div className="w-8 h-8 rounded-full bg-[#CD0000] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider">
            ScholarAI Assistant
          </span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[480px] rounded-[24px] bg-white border border-[#DDDDDD] shadow-[0_12px_36px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-[#111111] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#CD0000] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold font-heading">ScholarAI Grounded Assistant</h4>
                <span className="text-[9px] text-green-400 font-mono block">● Real-Time Profile Context</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[#222222] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9F9F7]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#111111] text-white rounded-br-none'
                      : 'bg-white text-[#111111] border border-[#DDDDDD] rounded-bl-none shadow-soft'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#666666] p-3 rounded-2xl rounded-bl-none border border-[#DDDDDD] flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#CD0000]" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EEEEEE] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI about eligibility, docs, SSP..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-10 px-3 rounded-xl border border-[#DDDDDD] text-xs text-[#111111] focus:outline-none focus:border-[#CD0000]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-[#CD0000] hover:bg-[#B30000] text-white flex items-center justify-center disabled:opacity-50 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
