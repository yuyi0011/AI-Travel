import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.5,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8000
};

const model = ai.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig
});

// Add back the chatSession export for backward compatibility
export const chatSession = model.startChat();

// JSON structure template
const jsonStructure = 
  "{\n" +
  "  \"hotels\": [\n" +
  "    {\n" +
  "      \"name\": \"Hotel name\",\n" +
  "      \"address\": \"Hotel address\",\n" +
  "      \"price\": \"Price per night\",\n" +
  "      \"image_url\": \"URL to hotel image\",\n" +
  "      \"coordinates\": {\"lat\": 0.0, \"lng\": 0.0},\n" +
  "      \"rating\": \"Rating out of 5\",\n" +
  "      \"description\": \"Hotel description\"\n" +
  "    }\n" +
  "  ],\n" +
  "  \"itinerary\": [\n" +
  "    {\n" +
  "      \"day\": 1,\n" +
  "      \"activities\": [{\"name\": \"Activity name\", \"description\": \"Description\", \"time\": \"Time\", \"cost\": \"Cost\"}],\n" +
  "      \"meals\": [{\"name\": \"Meal name\", \"description\": \"Description\", \"cost\": \"Cost\"}],\n" +
  "      \"tips\": [\"Tip 1\", \"Tip 2\"]\n" +
  "    }\n" +
  "  ],\n" +
  "  \"recommendations\": [\"Recommendation 1\", \"Recommendation 2\"]\n" +
  "}\n";

// Function to use the existing chatSession
export async function sendChatMessage(prompt) {
  try {
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chat:", error);
    return "Error processing message. Please try again.";
  }
}

// Function to run a new chat query
export async function runChat(prompt) {
  try {
    // Create a new chat session for each query
    const session = model.startChat();
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Try to parse as JSON to validate
    try {
      const jsonResponse = JSON.parse(textResponse);
      return JSON.stringify(jsonResponse, null, 2); // Return pretty-printed JSON
    } catch (jsonError) {
      console.warn("Response is not valid JSON:", jsonError);
      return textResponse; // Return the text anyway
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating travel plan. Please try again.";
  }
}

// Function to generate a travel plan
export async function generateTravelPlan(destination) {
  try {
    const genericPrompt = `Generate a travel plan for ${destination || "a popular destination"}. ` +
      "Format your response as valid JSON with the following structure:\n" +
      jsonStructure +
      "Ensure the response is properly formatted as valid, parseable JSON without any additional text.";
      
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: genericPrompt }] }],
    });
    
    const textResponse = result.response.text();
    
    // Try to parse as JSON to validate
    try {
      const jsonResponse = JSON.parse(textResponse);
      return JSON.stringify(jsonResponse, null, 2); // Return pretty-printed JSON
    } catch (jsonError) {
      console.warn("Response is not valid JSON:", jsonError);
      return textResponse; // Return the text anyway
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating travel plan. Please try again.";
  }
}

// Function specifically for creating a complete travel itinerary
export async function createTravelItinerary(destination, days, budget, travelers) {
  try {
    const customPrompt = `Generate Travel plan for ${days || 3} days in ${destination || "a popular destination"}, for ${travelers || 2} people with a budget of $${budget || 3000}. ` +
      "Format your response as valid JSON with the following structure:\n" +
      jsonStructure +
      "Ensure the response is properly formatted as valid, parseable JSON without any additional text.";
      
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: customPrompt }] }],
    });
    
    const textResponse = result.response.text();
    
    // Try to parse as JSON to validate
    try {
      const jsonResponse = JSON.parse(textResponse);
      return jsonResponse; // Return parsed JSON object
    } catch (jsonError) {
      console.warn("Response is not valid JSON:", jsonError);
      return { error: "Could not generate valid JSON response", text: textResponse };
    }
  } catch (error) {
    console.error("Error generating travel itinerary:", error);
    return { error: "Error calling Gemini API", details: error.message };
  }
}