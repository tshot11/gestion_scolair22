import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Minus,
  Maximize2,
  HeadphonesIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("ai"); /* 'ai' or 'human' */
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Bonjour ! Je suis l'assistant IA de l'école. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const onlineStaff = [
    {
      id: 1,
      name: "Alice KABUYA",
      role: "Support Technique",
      status: "En ligne",
    },
    { id: 2, name: "M. Dieudonné", role: "Direction", status: "En ligne" },
  ];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab, isOpen, isMinimized]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || activeTab === "human")
      return; /* For now human just mock */
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          context:
            "Tu es un assistant IA poli, utile et professionnel pour le Complexe Scolaire John Tshot.",
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch (error) {
      console.error("Erreur de chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Désolé, je rencontre des difficultés techniques actuellement. Veuillez réessayer plus tard ou contacter l'administration.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-[14px] bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group"
      >
        {" "}
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />{" "}
      </button>
    );
  }
  return (
    <AnimatePresence>
      {" "}
      <motion.div
        drag
        dragConstraints={{ left: -500, right: 50, top: -500, bottom: 50 }}
        dragMomentum={false}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed z-50 flex flex-col bg-[#12305A]/45 B1736]/90 backdrop-blur-md border border-[#94C5FF]/15 shadow-2xl rounded-2xl overflow-hidden ${isMinimized ? "w-72 h-14 bottom-6 right-6" : "w-80 sm:w-96 h-[500px] max-h-[85vh] bottom-6 right-6"}`}
        style={{ touchAction: "none" }}
      >
        {" "}
        {/* Header - Draggable Area */}{" "}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-move select-none shrink-0">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            {activeTab === "ai" ? (
              <Bot className="w-5 h-5" />
            ) : (
              <HeadphonesIcon className="w-5 h-5" />
            )}{" "}
            <span className="font-semibold text-sm">Assistance</span>{" "}
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-[#12305A]/45 rounded-md transition-colors"
            >
              {" "}
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}{" "}
            </button>{" "}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#12305A]/45 rounded-md transition-colors"
            >
              {" "}
              <X className="w-4 h-4" />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {!isMinimized && (
          <>
            {" "}
            {/* Tabs */}{" "}
            <div className="flex px-2 py-2 gap-2 bg-slate-50 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 border-b border-[#94C5FF]/15 shrink-0">
              {" "}
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "ai" ? "bg-blue-600 text-white shadow-sm" : "text-[#F5F9FF]0 hover:bg-slate-200 :bg-[#12305A]/45 backdrop-blur-md"}`}
              >
                {" "}
                Assistant IA{" "}
              </button>{" "}
              <button
                onClick={() => setActiveTab("human")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "human" ? "bg-emerald-500 text-white shadow-sm" : "text-[#F5F9FF]0 hover:bg-slate-200 :bg-[#12305A]/45 backdrop-blur-md"}`}
              >
                {" "}
                Administration{" "}
              </button>{" "}
            </div>{" "}
            {/* Chat Area */}{" "}
            {activeTab === "ai" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {" "}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {" "}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-[#12305A]/45 backdrop-blur-md text-[#F5F9FF] rounded-tl-sm border border-[#94C5FF]/15"}`}
                    >
                      {" "}
                      {msg.text}{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
                {isLoading && (
                  <div className="flex justify-start">
                    {" "}
                    <div className="bg-[#12305A]/45 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-2 border border-[#94C5FF]/15">
                      {" "}
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div ref={messagesEndRef} />{" "}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 ">
                {" "}
                <p className="text-xs text-[#F5F9FF]0 mb-2 text-center">
                  Personnel disponible en ligne
                </p>{" "}
                {onlineStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-3 bg-white A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md rounded-xl border border-[#94C5FF]/15 shadow-sm"
                  >
                    {" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <div className="w-8 h-8 rounded-full bg-[#0B1736]/50 flex items-center justify-center text-[#F5F9FF]0 ">
                        {" "}
                        <User className="w-4 h-4" />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <div className="text-sm font-bold text-[#F5F9FF] ">
                          {staff.name}
                        </div>{" "}
                        <div className="text-[10px] text-[#F5F9FF]0 ">
                          {staff.role}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                      {" "}
                      Contacter{" "}
                    </button>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
            {/* Input Area */}{" "}
            {activeTab === "ai" && (
              <form
                onSubmit={handleSend}
                className="p-3 bg-white B1736] border-t border-[#94C5FF]/15 shrink-0"
              >
                {" "}
                <div className="flex items-center gap-2 relative">
                  {" "}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-4 py-2.5 text-sm text-[#F5F9FF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />{" "}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {" "}
                    <Send className="w-4 h-4" />{" "}
                  </button>{" "}
                </div>{" "}
              </form>
            )}{" "}
          </>
        )}{" "}
      </motion.div>{" "}
    </AnimatePresence>
  );
}
