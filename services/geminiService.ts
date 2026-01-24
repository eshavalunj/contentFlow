
import { GoogleGenAI, Type } from "@google/genai";
import { ContentTheme, Platform, SocialPost, PostVersion, PostFrame } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateCampaignContent = async (
  sourceText: string,
  intent: string,
  platforms: Platform[]
): Promise<ContentTheme[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const platformNames = platforms.join(", ");

  const systemInstruction = `
    You are an expert social media strategist and creative director. 
    Analyze source material and create a multi-part social media campaign with high stylistic diversity.
    
    1. Identify 2 distinct thematic angles (themes).
    2. For EACH theme and EACH platform (${platformNames}), generate 2 distinct STYLISTIC VERSIONS (e.g., "The Educational Way", "The Storytelling Way", "The Aggressive Hook Way", "The Star Wars Way").
    3. Each version must be a series of 3 frames (slides for Instagram, thread items for Twitter/LinkedIn).
    4. Return valid JSON only.
  `;

  const prompt = `
    Analyze this source: "${sourceText.substring(0, 8000)}"
    Objective: "${intent}"
    Requested Channels: ${platformNames}
    
    For each channel, I need 2 distinct versions, and each version should have a sequence of 3 frames.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  posts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING, enum: ["Twitter", "Instagram", "LinkedIn"] },
                        versions: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              label: { type: Type.STRING, description: "Style description, e.g., 'The Star Wars way'" },
                              frames: {
                                type: Type.ARRAY,
                                items: {
                                  type: Type.OBJECT,
                                  properties: {
                                    content: { type: Type.STRING },
                                    imageDescription: { type: Type.STRING }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                required: ["title", "rationale", "posts"]
              }
            }
          }
        }
      }
    });

    let jsonText = response.text || "";
    const cleanedJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    
    return parsed.themes.map((theme: any): ContentTheme => ({
      id: generateId(),
      title: theme.title,
      rationale: theme.rationale,
      posts: theme.posts.map((post: any): SocialPost => ({
        id: generateId(),
        platform: post.platform as Platform,
        versions: post.versions.map((v: any): PostVersion => ({
          id: generateId(),
          label: v.label,
          status: 'PENDING',
          frames: v.frames.map((f: any): PostFrame => ({
            id: generateId(),
            content: f.content,
            imageDescription: f.imageDescription
          }))
        }))
      }))
    }));

  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    await new Promise(resolve => setTimeout(resolve, 2500));

    return [
      {
        id: generateId(),
        title: "Knowledge Transfer",
        rationale: "Positioning complex information as accessible lore.",
        posts: platforms.map(p => ({
          id: generateId(),
          platform: p,
          versions: [
            {
              id: generateId(),
              label: "The Star Wars way",
              status: 'PENDING',
              frames: Array.from({length: 3}).map((_, i) => ({
                id: generateId(),
                content: `In a galaxy far away, episode ${i+1}... learning about transformers is the ultimate force.`,
                imageDescription: `Cinematic Star Wars aesthetic slide ${i+1}`
              }))
            },
            {
              id: generateId(),
              label: "The Indian way",
              status: 'PENDING',
              frames: Array.from({length: 3}).map((_, i) => ({
                id: generateId(),
                content: `Namaste! Let's explore the traditional wisdom of architecture ${i+1}.`,
                imageDescription: `Vibrant Indian cultural motifs and patterns slide ${i+1}`
              }))
            }
          ]
        }))
      }
    ];
  }
};
