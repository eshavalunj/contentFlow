
import { GoogleGenAI, Type } from "@google/genai";
import { ContentTheme, Platform, SocialPost, PostVersion } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Generates an image based on a text prompt using gemini-2.5-flash-image.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional social media graphic: ${prompt}` }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data");
  } catch (error) {
    console.error("Image generation failed:", error);
    return `https://picsum.photos/seed/${generateId()}/800/800`;
  }
};

export const generateCampaignContent = async (
  sourceText: string,
  intent: string,
  platforms: Platform[]
): Promise<ContentTheme[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const platformNames = platforms.join(", ");

  const systemInstruction = `
    You are an expert social media strategist. 
    Analyze source material and create a campaign with 2 themes.
    
    For each theme and EACH platform (${platformNames}), generate 3 independent stylistic VERSIONS of the post (e.g., "The Star Wars Way", "The Indian Way", "Corporate Minimalist").
    Each version is a SINGLE post with text and an image prompt. 
    Do not generate sequences or carousels, only independent options.
    
    Return valid JSON.
  `;

  const prompt = `
    Analyze source: "${sourceText.substring(0, 5000)}"
    Intent: "${intent}"
    Platforms: ${platformNames}
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
                              label: { type: Type.STRING },
                              content: { type: Type.STRING },
                              imageDescription: { type: Type.STRING }
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

    const parsed = JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
    
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
          content: v.content,
          imageDescription: v.imageDescription,
          isApproved: false,
          scheduledDates: [],
          imageUrl: `https://picsum.photos/seed/${generateId()}/800/800`
        }))
      }))
    }));

  } catch (error) {
    console.error("Fallback to mock data:", error);
    return [
      {
        id: generateId(),
        title: "Future of Transformers",
        rationale: "Positioning AI education through culturally relevant lenses.",
        posts: platforms.map(p => ({
          id: generateId(),
          platform: p,
          versions: [
            { id: generateId(), label: "The Star Wars way", content: "May the Transformers be with you. Exploring the Jedi wisdom of attention mechanisms.", imageDescription: "Cinematic space battle with transformer architecture floating in stardust.", isApproved: false, scheduledDates: [], imageUrl: `https://picsum.photos/seed/${generateId()}/800/800` },
            { id: generateId(), label: "The Indian way", content: "Namaste! Integrating modern ML with timeless engineering patterns.", imageDescription: "Intricate mandala patterns merging with circuit board diagrams.", isApproved: false, scheduledDates: [], imageUrl: `https://picsum.photos/seed/${generateId()}/800/800` },
            { id: generateId(), label: "Minimalist Executive", content: "Efficiency redefined. The transformer standard.", imageDescription: "Clean typography on slate grey concrete background.", isApproved: false, scheduledDates: [], imageUrl: `https://picsum.photos/seed/${generateId()}/800/800` }
          ]
        }))
      }
    ];
  }
};
