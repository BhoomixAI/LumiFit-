"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, CornerDownLeft, Lightbulb } from "lucide-react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { CatalogItem } from "@/data/catalog";
import { useCatalog } from "@/hooks/useCatalog";

// API request/response types (separate from UI ChatMessage)
interface AIChatbotAPIMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotAPIPayload {
  message?: string;
  image_data_url?: string | null;
  user_profile?: {
    seasonal_palette?: string;
    measurements?: MeasurementState;
    body_shape?: string;
    style_preference?: string;
  } | null;
  conversation_history?: AIChatbotAPIMessage[];
}

interface AIChatbotAPIResponse {
  ok: boolean;
  response_text: string;
  recommended_item_ids: string[];
  error?: string;
}

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
  userProfile?: {
    seasonal_palette?: string;
    measurements: MeasurementState;
    body_shape?: string;
    style_preference?: string;
  };
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
  userProfile,
}) => {
  const { catalog, loading, error } = useCatalog();
  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];
  const waistToHip = (measurements.waistIn / (measurements.hipsIn || 1)).toFixed(2);

  // Build user_profile for API from props (no Supabase lookup)
  const user_profile = userProfile
    ? {
        seasonal_palette: userProfile.seasonal_palette || selectedPaletteId,
        measurements: userProfile.measurements || measurements,
        body_shape: userProfile.body_shape,
        style_preference: userProfile.style_preference,
      }
    : {
        seasonal_palette: selectedPaletteId,
        measurements,
        body_shape: "",
        style_preference: "",
      };

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
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  // API-specific conversation history (separate from UI messages)
  const [conversationHistory, setConversationHistory] = useState<AIChatbotAPIMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Image upload: read file as data URL, validate type and size
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Client-side size limit: 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(`Image is too large (${((file.size / 1024 / 1024) * 100).toFixed(1)}MB). Maximum 5MB.`);
      return;
    }

    setIsImageUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (typeof result === "string") {
        // Optional: further compress/resize could happen here
        setImageDataUrl(result);
      }
      setIsImageUploading(false);
    };
    reader.onerror = () => {
      alert("Could not read the selected image.");
      setIsImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageDataUrl(null);
    // Reset file input value
    // Note: we can't directly reset the hidden input, but clearing state is enough
  };

  const addToConversationHistory = (role: "user" | "assistant", content: string) => {
    const newEntry: AIChatbotAPIMessage = { role, content };
    setConversationHistory((prev) => {
      const updated = [...prev, newEntry];
      // Keep only latest 6 messages/turns
      return updated.slice(-6);
    });
  };

  const sendToAPI = async (payload: AIChatbotAPIPayload) => {
    setIsTyping(true);
    setIsImageUploading(false);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as AIChatbotAPIResponse;

      if (!response.ok || !data.ok) {
        const errorMsg = data.error || "Failed to communicate with AI service.";
        throw new Error(errorMsg);
      }

      // On success:
      // 1. Display response_text as AI message
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // 2. Call onApplyRecommendation with recommended item IDs
      if (data.recommended_item_ids && data.recommended_item_ids.length > 0) {
        onApplyRecommendation({
          recommendedIds: data.recommended_item_ids,
        });
      }

      // 3. Update API conversation history
      // We add user message and AI response to history
      // The payload already includes the user message; we add the AI response here
      const assistantContent = data.response_text;
      if (assistantContent) {
        setConversationHistory((prev) => {
          const updated = [
            ...prev,
            { role: "assistant" as const, content: assistantContent },
          ].slice(-6); // keep last 6
          return updated;
        });
      }

      // 4. Clear the image after successful send
      setImageDataUrl(null);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to communicate with AI service. Please try again.";

      // Display friendly error message
      const errorAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Sorry, I couldn't process your request. ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorAiMsg]);

      // Still update conversation history with the error attempt
      setConversationHistory((prev) => {
        const updated = [
          ...prev,
          { role: "assistant" as const, content: `Error: ${errorMessage}` },
        ].slice(-6);
        return updated;
      });

      return false;
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    // If image is present, send image + text; otherwise send text only
    if (imageDataUrl) {
      // Image mode: send both image and text message
      const query = (textToSend || inputValue).trim();
      if (!query && !imageDataUrl) return;

      const payload: AIChatbotAPIPayload = {
        message: query || "",
        image_data_url: imageDataUrl,
        user_profile: user_profile,
        conversation_history: conversationHistory,
      };

      sendToAPI(payload);
    } else {
      // Text-only mode: send message without image
      const query = (textToSend || inputValue).trim();
      if (!query) return;

      const payload: AIChatbotAPIPayload = {
        message: query,
        image_data_url: null,
        user_profile: user_profile,
        conversation_history: conversationHistory,
      };

      sendToAPI(payload);
    }
  };

  // Clean up file input on unmount / re-render
  // (No explicit cleanup needed for FileReader)

  const mapNounToCategory = (noun: string): string => {
    const n = noun.toLowerCase();
    if (["dress", "gown", "sundress", "dresses", "gowns", "sundresses"].includes(n)) return "dress";
    if (["jewel", "jewelry", "jewelleries", "necklace", "necklaces", "earring", "earrings", "bracelet", "bracelets", "choker", "chokers", "ring", "rings"].includes(n)) return "jewelry";
    if (["bottom", "bottoms", "pant", "pants", "trouser", "trousers", "skirt", "skirts", "jean", "jeans", "short", "shorts"].includes(n)) return "bottom";
    if (["top", "tops", "shirt", "shirts", "blouse", "blouses", "sweater", "sweaters", "cardigan", "cardigans"].includes(n)) return "top";
    return "all";
  };

  const scrollToBottomAuto = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottomAuto();
  }, [messages, isTyping]);

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
            <span>AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image upload button - triggers hidden file input */}
      <div className="pt-2 border-t border-sky-100/60 shrink-0">
        <label htmlFor="image-upload-input" className="flex items-center gap-2 cursor-pointer select-none">
          <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
          <span className="text-[10px] font-bold text-sky-600">Upload Photo</span>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* Image preview section - shown when an image is uploaded */}
      {imageDataUrl && (
        <div className="pt-3 pb-2 border-t border-sky-100/60 shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <img
              src={imageDataUrl}
              alt="User uploaded photo"
              className="w-24 h-24 rounded-2xl object-cover border border-sky-200"
            />
            <span className="text-[10px] font-bold text-slate-600">Photo uploaded</span>
            <button
              type="button"
              onClick={clearImage}
              className="ml-2 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            Drag & drop or click to change photo
          </p>
        </div>
      )}

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
            disabled={!inputValue.trim() && !imageDataUrl}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#90CDF4] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium flex items-center justify-center gap-1">
          <CornerDownLeft className="w-2.5 h-2.5" /> Press Enter to query catalog & filter grid
        </p>
      </div>
    </div>
  );
};