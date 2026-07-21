"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, CornerDownLeft, Lightbulb } from "lucide-react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { CATALOG_DATA, CatalogItem } from "@/data/catalog";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  matchedCount?: number;
}

export interface AIRecommendationFilter {
  category?: string;
  maxPrice?: number | null;
  searchQuery?: string;
  recommendedIds?: string[];
}

interface AIChatbotProps {
  measurements: MeasurementState;
  selectedPaletteId: string;
  onApplyRecommendation: (filter: AIRecommendationFilter) => void;
}

const INITIAL_SUGGESTIONS = [
  "Which dress goes with a gold necklace?",
  "What jewelry pairs with a silk blouse?",
  "Show casual tops under $80",
  "Recommend formal dresses for Winter Contrast",
];

export const AIChatbot: React.FC<AIChatbotProps> = ({
  measurements,
  selectedPaletteId,
  onApplyRecommendation,
}) => {
  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];
  const waistToHip = (measurements.waistIn / (measurements.hipsIn || 1)).toFixed(2);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello! I'm your LumiFit AI Stylist ✨. Calibrated to your **${palette.name}** palette and waist-to-hip ratio of **${waistToHip}**. Try asking *"Which dress goes with a gold necklace?"* or *"What jewelry pairs with a silk blouse?"*!`,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const mapNounToCategory = (noun: string): string => {
    const n = noun.toLowerCase();
    if (["dress", "gown", "sundress", "dresses", "gowns", "sundresses"].includes(n)) return "dress";
    if (["jewel", "jewelry", "jewelleries", "necklace", "necklaces", "earring", "earrings", "bracelet", "bracelets", "choker", "chokers", "ring", "rings"].includes(n)) return "jewelry";
    if (["bottom", "bottoms", "pant", "pants", "trouser", "trousers", "skirt", "skirts", "jean", "jeans", "short", "shorts"].includes(n)) return "bottom";
    if (["top", "tops", "shirt", "shirts", "blouse", "blouses", "sweater", "sweaters", "cardigan", "cardigans"].includes(n)) return "top";
    return "all";
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    const lowerQuery = query.toLowerCase();

    // 3-PASS INTENT PARSER
    let targetCategory = "all";

    // Pass 1: Interrogative / Action verb target (e.g. "which dress goes with...", "what jewelry matches...")
    const pass1Match = lowerQuery.match(
      /(?:which|what|best|choose|find|show|recommend|suggest|get|pick|pair)\s+(?:a\s+|the\s+|some\s+)?(dresses|dress|gowns|gown|sundresses|sundress|jewelleries|jewelry|jewel|necklaces|necklace|earrings|earring|bracelets|bracelet|chokers|choker|rings|ring|bottoms|bottom|pants|pant|trousers|trouser|skirts|skirt|jeans|jean|shorts|short|tops|top|shirts|shirt|blouses|blouse|sweaters|sweater|cardigans|cardigan)/i
    );

    if (pass1Match && pass1Match[1]) {
      targetCategory = mapNounToCategory(pass1Match[1]);
    } else {
      // Pass 2: Prepositional target (e.g. "jewelry for a dress", "dresses with gold necklace")
      const pass2Match = lowerQuery.match(
        /(dresses|dress|gowns|gown|sundresses|sundress|jewelleries|jewelry|jewel|necklaces|necklace|earrings|earring|bracelets|bracelet|chokers|choker|rings|ring|bottoms|bottom|pants|pant|trousers|trouser|skirts|skirt|jeans|jean|shorts|short|tops|top|shirts|shirt|blouses|blouse|sweaters|sweater|cardigans|cardigan)\s+(?:for|with|matching|pairing|to\s+go\s+with)/i
      );

      if (pass2Match && pass2Match[1]) {
        targetCategory = mapNounToCategory(pass2Match[1]);
      } else {
        // Pass 3: First apparel/jewelry noun mentioned in query
        const pass3Match = lowerQuery.match(
          /(dresses|dress|gowns|gown|sundresses|sundress|jewelleries|jewelry|jewel|necklaces|necklace|earrings|earring|bracelets|bracelet|chokers|choker|rings|ring|bottoms|bottom|pants|pant|trousers|trouser|skirts|skirt|jeans|jean|shorts|short|tops|top|shirts|shirt|blouses|blouse|sweaters|sweater|cardigans|cardigan)/i
        );
        if (pass3Match && pass3Match[1]) {
          targetCategory = mapNounToCategory(pass3Match[1]);
        }
      }
    }

    // Parse Max Price Limit
    let maxPrice: number | null = null;
    const priceMatch =
      lowerQuery.match(/(?:under|less than|below|max|\$)\s*(\d+)/i) ||
      lowerQuery.match(/(\d+)\s*(?:dollars|bucks)/i);
    if (priceMatch && priceMatch[1]) {
      const parsed = parseInt(priceMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        maxPrice = parsed;
      }
    }

    // Aesthetic & Seasonal Palette Pairing Logic
    let paletteTag = "";
    if (selectedPaletteId === "warm-autumn" || lowerQuery.includes("autumn")) paletteTag = "warm-toned";
    else if (selectedPaletteId === "cool-summer" || lowerQuery.includes("summer")) paletteTag = "cool-toned";
    else if (selectedPaletteId === "spring-radiance" || lowerQuery.includes("spring")) paletteTag = "warm-toned";
    else if (selectedPaletteId === "winter-contrast" || lowerQuery.includes("winter")) paletteTag = "cool-toned";

    // Style keywords
    const styleKeywords = ["casual", "formal", "boho", "minimal", "vintage", "chic", "glamour", "party", "romantic", "business", "tailored", "cozy", "resortwear", "gold", "pearl", "silver", "emerald", "burgundy", "navy", "silk", "velvet", "denim", "linen"].filter(
      (k) => lowerQuery.includes(k)
    );

    // Score items
    let scoredItems = CATALOG_DATA.map((item) => {
      let score = 0;

      // HARD CATEGORY FILTERING: Disqualify items not in requested target category!
      if (targetCategory !== "all" && item.category !== targetCategory) {
        return { item, score: -1 };
      }

      // Max price constraint
      if (maxPrice !== null && item.price > maxPrice) {
        return { item, score: -1 };
      }

      // Palette undertone match
      if (paletteTag && item.style.includes(paletteTag)) {
        score += 3;
      }

      // Style/Look keyword matches
      styleKeywords.forEach((kw) => {
        const itemText = `${item.name} ${item.color} ${item.style} ${item.category}`.toLowerCase();
        if (itemText.includes(kw)) score += 5;
      });

      return { item, score };
    }).filter((obj) => obj.score >= 0);

    // Sort by highest match score
    scoredItems.sort((a, b) => b.score - a.score);

    // If zero matches under tight keywords, relax style keywords but KEEP target category & price limits
    if (scoredItems.length === 0) {
      scoredItems = CATALOG_DATA.filter(
        (item) =>
          (targetCategory === "all" || item.category === targetCategory) &&
          (maxPrice === null || item.price <= maxPrice)
      ).map((item) => ({ item, score: 1 }));
    }

    const matchedItems = scoredItems.map((obj) => obj.item);
    const recommendedIds = matchedItems.map((item) => item.id);

    // Apply HARD filter sync to CatalogExplorer on right panel!
    onApplyRecommendation({
      category: targetCategory,
      maxPrice: maxPrice,
      searchQuery: "",
      recommendedIds: recommendedIds,
    });

    // Generate Dynamic AI Response String
    setTimeout(() => {
      let aiText = "";

      if (matchedItems.length > 0) {
        const top3 = matchedItems.slice(0, 3);
        const itemFormatted = top3.map((m) => `**${m.name}** ($${m.price.toFixed(2)})`).join(", ");

        aiText = `Based on your request, the best matching **${targetCategory.toUpperCase()}** picks for your **${palette.name}** profile are: ${itemFormatted}. I've hard-filtered your catalog grid on the right to display ONLY these **${matchedItems.length}** matching items! ✨`;
      } else {
        aiText = `I couldn't find catalog items matching "${query}". I've reset the catalog grid so you can explore all items!`;
        onApplyRecommendation({
          category: "all",
          maxPrice: null,
          searchQuery: "",
          recommendedIds: [],
        });
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        matchedCount: matchedItems.length,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-5 sm:p-6 shadow-xl shadow-sky-100/50 flex flex-col h-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sky-100/80 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#90CDF4] via-[#A0C4FF] to-[#FEF08A] text-slate-900 flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-sky-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-slate-900">LumiFit AI Stylist</h3>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Hard-Filtering Catalog Grid</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FEF08A]/80 text-yellow-950 border border-yellow-300 flex items-center gap-1 shadow-2xs">
          <Sparkles className="w-3 h-3 text-yellow-700" /> {palette.name}
        </span>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs sm:text-sm ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ${
                msg.sender === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-gradient-to-tr from-[#90CDF4] to-[#A0C4FF] text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[84%] rounded-2xl p-3.5 shadow-xs font-medium leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-[#90CDF4] to-[#70B4F8] text-white rounded-tr-xs"
                  : "bg-[#FDFBF7] border border-sky-100 text-slate-800 rounded-tl-xs shadow-sky-100/30"
              }`}
            >
              <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-sky-100/40">
                <span
                  className={`text-[9px] font-bold ${
                    msg.sender === "user" ? "text-sky-100" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
                {msg.matchedCount !== undefined && (
                  <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-200">
                    {msg.matchedCount} catalog matches
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-sky-50/70 p-3 rounded-2xl w-fit border border-sky-100 font-medium">
            <Bot className="w-4 h-4 text-sky-600 animate-bounce" />
            <span>Parsing target intent &amp; applying hard grid filter...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="pt-3 pb-2 border-t border-sky-100/60 shrink-0 space-y-1.5">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Lightbulb className="w-3 h-3 text-yellow-600" /> Dynamic Prompts
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              suppressHydrationWarning
              onClick={() => handleSendMessage(suggestion)}
              className="text-[11px] font-semibold py-1.5 px-3 rounded-xl bg-sky-50/80 hover:bg-sky-100 border border-sky-200 text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Box */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#FDFBF7] p-2 rounded-2xl border border-sky-200 focus-within:border-[#90CDF4] focus-within:ring-2 focus-within:ring-sky-200/50 transition-all shadow-inner"
        >
          <input
            type="text"
            suppressHydrationWarning
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Try: 'Which dress goes with a gold necklace?'..."
            className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-800 focus:outline-none font-medium placeholder:text-slate-400"
          />

          <button
            type="submit"
            suppressHydrationWarning
            disabled={!inputValue.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#90CDF4] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium flex items-center justify-center gap-1">
          <CornerDownLeft className="w-2.5 h-2.5" /> Press Enter to query catalog &amp; filter grid
        </p>
      </div>
    </div>
  );
};
