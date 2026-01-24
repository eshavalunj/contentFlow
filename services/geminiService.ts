
import { GoogleGenAI, Type } from "@google/genai";
import { ContentTheme, Platform, SocialPost } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Content Generator for fallback
const getMockContent = (platform: Platform, index: number) => {
    const hashtags = "#Future #Tech #Innovation #AI";
    const loremShort = "Transforming the way we approach complex data structures. Our latest analysis reveals the hidden potential of distributed networks.";
    const loremLong = "In our most recent deep dive, we've identified significant shifts in the industry standard for performance scaling. By leveraging new architectural patterns, teams can expect a 40% reduction in latency without compromising on safety protocols. This breakthrough marks a turning point for sustainable infrastructure.";
    
    if (platform === 'Twitter') {
        return index === 0 ? `Unlocking performance at scale: 40% reduction in latency is now the new standard. 🚀 ${hashtags}` : `Architectural patterns are shifting. Are you ready for the new era of sustainable infra? 🌐 ${hashtags}`;
    } else if (platform === 'LinkedIn') {
        return `Strategic Insights: The Future of Scalable Infrastructure\n\n${loremLong}\n\nWhat are your thoughts on these shifts? Let's discuss below.\n\n${hashtags}`;
    } else {
        return `The standard is shifting. 📸\n\nPerformance scaling redefined. Architecture matters.\n\n${hashtags}`;
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
    Analyze source material and create a multi-part social media campaign.
    
    1. Identify 2 distinct thematic angles (themes).
    2. For EACH theme, generate posts ONLY for: ${platformNames}.
       - Twitter: 2 posts.
       - LinkedIn: 1 post.
       - Instagram: 1 post.
    3. Return valid JSON only. Do not add extra text.
  `;

  const prompt = `
    Analyze this source: "${sourceText.substring(0, 8000)}"
    Objective: "${intent}"
    Create a campaign for: ${platformNames}
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
                        content: { type: Type.STRING },
                        imageDescription: { type: Type.STRING }
                      },
                      required: ["platform", "content", "imageDescription"]
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
    // Clean potential markdown wrap
    const cleanedJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    
    return parsed.themes.map((theme: any): ContentTheme => ({
      id: generateId(),
      title: theme.title,
      rationale: theme.rationale,
      posts: theme.posts.map((post: any): SocialPost => ({
        id: generateId(),
        platform: post.platform as Platform,
        content: post.content,
        imageDescription: post.imageDescription,
        status: 'PENDING'
      }))
    }));

  } catch (error) {
    console.error("Gemini Error, falling back to mock:", error);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockThemes = [
      { title: "Efficiency Breakthroughs", rationale: "Highlighting performance gains and cost-reduction vectors." },
      { title: "The Next Era", rationale: "Positioning the solution as a foundational shift for future industry leaders." }
    ];

    return mockThemes.map((theme): ContentTheme => ({
        id: generateId(),
        title: theme.title,
        rationale: theme.rationale,
        posts: platforms.flatMap(platform => {
            const count = platform === 'Twitter' ? 2 : 1;
            return Array.from({ length: count }).map((_, i): SocialPost => ({
                id: generateId(),
                platform: platform,
                content: getMockContent(platform, i),
                imageDescription: "A minimalist studio shot of geometric glass sculptures with sharp blue backlighting on a slate background.",
                status: 'PENDING'
            }));
        })
    }));
  }
};
