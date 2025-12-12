import { GoogleGenAI, Type } from "@google/genai";
import { Activity, ItineraryDay, UserPreferences } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchSuggestedActivities = async (prefs: UserPreferences): Promise<Activity[]> => {
  const ai = createClient();
  const locationName = prefs.location?.name || "current location";

  const prompt = `
    Suggest 15 specific, real or realistic kid-friendly activities near ${locationName} (Lat: ${prefs.location?.lat}, Lng: ${prefs.location?.lng}).
    Focus on children aged ${prefs.age}.
    Interests: ${prefs.interests.join(', ')}.
    ${prefs.isIndoor ? "Prefer indoor activities." : "Prefer outdoor activities."}
    Price level should be roughly level ${prefs.maxPrice} (0=Free, 3=Exp).
    
    For each activity, provide a 'visualPrompt' that describes exactly what a photo of this activity would look like, so I can generate a picture. e.g. "Brightly colored indoor lego playground with children building towers" or "Sunny outdoor park with a large wooden climbing frame and green grass".
    
    Return a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              headline: { type: Type.STRING, description: "Catchy 3-word headline" },
              description: { type: Type.STRING },
              visualPrompt: { type: Type.STRING, description: "A detailed visual description of the scene for image generation (max 10 words)." },
              ageRange: { type: Type.STRING },
              priceLevel: { type: Type.STRING, enum: ["Free", "$", "$$", "$$$"] },
              duration: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              isIndoor: { type: Type.BOOLEAN },
            }
          }
        }
      }
    });

    if (response.text) {
      const rawActivities = JSON.parse(response.text) as any[];
      return rawActivities.map((act, index) => {
        // Fallback if visualPrompt is missing, use name
        const imgQuery = act.visualPrompt || `${act.name} children family fun`;
        // Encode for URL
        const encodedPrompt = encodeURIComponent(`${imgQuery} photorealistic 4k bright`);
        
        return {
          ...act,
          id: act.id || `act-${Date.now()}-${index}`,
          // Use Pollinations for context-aware AI imagery that matches the description
          imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=1200&nologo=true&seed=${index + 123}`, 
          lat: (prefs.location?.lat || 0) + (Math.random() - 0.5) * 0.05, 
          lng: (prefs.location?.lng || 0) + (Math.random() - 0.5) * 0.05,
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Gemini fetch error:", error);
    return [];
  }
};

export const generateHolidayItinerary = async (prefs: UserPreferences, daysCount: number = 14): Promise<ItineraryDay[]> => {
  const ai = createClient();
  const locationName = prefs.location?.name || "the destination";

  const prompt = `
    Create a detailed ${daysCount}-day holiday itinerary for a family with a ${prefs.age} year old child in ${locationName}.
    Interests: ${prefs.interests.join(', ')}.
    
    For each day, provide exactly 4 slots:
    1. Morning (9-11am): Main activity.
    2. Lunch (12-1pm): A kid-friendly food spot, specific restaurant or picnic spot.
    3. Afternoon (2-4pm): Adventure or play activity.
    4. Evening: A wind-down activity or bedtime story theme.

    Return JSON array of days.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              dayLabel: { type: Type.STRING, description: "e.g. Mon, Tue" },
              morning: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              lunch: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              afternoon: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              evening: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ItineraryDay[];
    }
    return [];
  } catch (error) {
    console.error("Gemini itinerary error:", error);
    return [];
  }
};