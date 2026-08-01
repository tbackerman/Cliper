import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initializer for Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ClipViral AI API" });
});

// AI Video Analysis & Auto-Clipping Endpoint
app.post("/api/gemini/analyze-video", async (req, res) => {
  try {
    const { inputType, url, textContent, topic, targetLanguage = "id" } = req.body;

    const ai = getGenAI();

    const systemInstruction = `Kamu adalah pakar AI Short Video Clipper & Editor Strategist untuk TikTok, Instagram Reels, dan YouTube Shorts.
Tugasmu adalah menganalisis transkrip, topik, atau konteks video panjang dan mengekstrak 3 sampai 4 potongan klip pendek terbaik (15-50 detik) yang paling berpotensi viral (High Virality Hook).

Format keluaran HARUS dalam JSON valid yang berisi daftar 'clips'.
Setiap klip harus menyertakan:
- title: Judul singkat yang menggugah rasa penasaran (bahasa ${targetLanguage === "id" ? "Indonesia" : "Inggris"})
- hookText: Teks overlay pembuka (Hook) di detik 0-3
- startTimeSec: Detik awal klip
- endTimeSec: Detik akhir klip (durasi ideal 15 - 45 detik)
- durationSec: Durasi total dalam detik
- viralScore: Skor potensi viral (angka 80 - 99)
- reasoning: Alasan psikologis kenapa bagian ini sangat berpotensi viral
- category: Kategori klip (misal: "Mindset Bomb", "Plot Twist", "Pro Tip", "Emotional Peak", "Actionable Step")
- autoCaptions: Array objek kata/kalimat bertimestamp [{ start: number, end: number, text: string, highlight: boolean }]
- hashtags: Array tagar tren (misal: ["#fyp", "#berandafyp", "#edukasi", "#mindset", "#viralindonesia"])
- platformCustomization: Objek dengan teks caption khusus TikTok dan Instagram Reels.`;

    const userPrompt = `Analisis konten video berikut dan hasilkan 3-4 rekomendasi klip video pendek viral:
Tipe Input: ${inputType || "url_or_transcript"}
${url ? `URL Video: ${url}` : ""}
${topic ? `Topik / Niche: ${topic}` : ""}
${textContent ? `Transkrip / Deskripsi Konten: \n"""\n${textContent}\n"""` : ""}

Buatlah potongan klip yang memiliki struktur pembuka kuat (hook), inti cerita, dan pesan penutup yang menggantung/membuat audiens terkesan!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Ringkasan analisis keseluruhan konten" },
            suggestedMainCategory: { type: Type.STRING, description: "Kategori utama konten" },
            clips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  hookText: { type: Type.STRING },
                  startTimeSec: { type: Type.NUMBER },
                  endTimeSec: { type: Type.NUMBER },
                  durationSec: { type: Type.NUMBER },
                  viralScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  category: { type: Type.STRING },
                  autoCaptions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        start: { type: Type.NUMBER },
                        end: { type: Type.NUMBER },
                        text: { type: Type.STRING },
                        highlight: { type: Type.BOOLEAN },
                      },
                      required: ["start", "end", "text"],
                    },
                  },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  platformCustomization: {
                    type: Type.OBJECT,
                    properties: {
                      tiktokCaption: { type: Type.STRING },
                      instagramCaption: { type: Type.STRING },
                      suggestedAudio: { type: Type.STRING },
                    },
                    required: ["tiktokCaption", "instagramCaption"],
                  },
                },
                required: [
                  "title",
                  "hookText",
                  "startTimeSec",
                  "endTimeSec",
                  "durationSec",
                  "viralScore",
                  "reasoning",
                  "category",
                  "autoCaptions",
                  "hashtags",
                  "platformCustomization",
                ],
              },
            },
          },
          required: ["summary", "clips"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/gemini/analyze-video:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal menganalisis video dengan Gemini AI.",
    });
  }
});

// AI Social Caption Generator / Optimizer
app.post("/api/gemini/generate-caption", async (req, res) => {
  try {
    const { videoTitle, clipTopic, platform = "tiktok", tone = "viral" } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Buatkan caption menarik dan teroptimasi algoritma untuk ${platform.toUpperCase()} mengenai klip berjudul "${videoTitle}". Topik: "${clipTopic}". Nada: ${tone}. Sertakan emoji yang relevan, call to action (CTA), dan 6-8 hashtag paling ramai.`,
    });

    res.json({
      success: true,
      caption: response.text || "",
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/gemini/generate-caption:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal membuat caption AI.",
    });
  }
});

// Direct Social Media Upload API Simulation (TikTok & Instagram)
app.post("/api/social/publish", async (req, res) => {
  try {
    const { clipId, clipTitle, targetPlatforms, scheduledAt, caption, hashtags } = req.body;

    // Simulate multi-stage API dispatch payload to TikTok Content Posting API & Instagram Graph API
    const simulatedLog = [];

    if (targetPlatforms.includes("tiktok")) {
      simulatedLog.push({
        platform: "tiktok",
        status: "success",
        postId: `tt_vid_${Math.floor(Math.random() * 899999 + 100000)}`,
        shareUrl: `https://www.tiktok.com/@creator_studio/video/${Math.floor(Math.random() * 8999999999 + 1000000000)}`,
        apiResponseCode: 200,
        platformStatus: "DIRECT_POSTED",
      });
    }

    if (targetPlatforms.includes("instagram")) {
      simulatedLog.push({
        platform: "instagram",
        status: "success",
        postId: `ig_reel_${Math.floor(Math.random() * 899999 + 100000)}`,
        shareUrl: `https://www.instagram.com/reel/C${Math.random().toString(36).substring(2, 11)}/`,
        apiResponseCode: 200,
        platformStatus: "REELS_CONTAINER_FINISHED",
      });
    }

    res.json({
      success: true,
      message: scheduledAt ? "Konten berhasil dijadwalkan!" : "Konten berhasil diunggah langsung via API!",
      publishedAt: new Date().toISOString(),
      isScheduled: Boolean(scheduledAt),
      scheduledAt: scheduledAt || null,
      results: simulatedLog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal mengunggah ke media sosial.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server ClipViral AI running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.env.VERCEL !== "1") {
  startServer();
}
