import { GoogleGenerativeAI } from "@google/generative-ai";

<<<<<<< HEAD
  
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
   export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate Travel Plan for Location : Shang hai, for 3 Days for Couple with a Cheap budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"hotels\": [\n    {\n      \"hotelName\": \"The D Las Vegas\",\n      \"hotelAddress\": \"301 Fremont Street, Las Vegas, NV 89101\",\n      \"price\": \"$50-$100 per night\",\n      \"hotelImageUrl\": \"https://www.theDcasino.com/images/hero/main-hero-02.jpg\",\n      \"geoCoordinates\": \"36.1695, -115.1438\",\n      \"rating\": \"3.5 stars\",\n      \"description\": \"A budget-friendly hotel located in downtown Las Vegas with a retro vibe. It features a casino, a pool, and several dining options.\"\n    },\n    {\n      \"hotelName\": \"Circus Circus Hotel & Casino\",\n      \"hotelAddress\": \"2880 Las Vegas Blvd S, Las Vegas, NV 89109\",\n      \"price\": \"$40-$80 per night\",\n      \"hotelImageUrl\": \"https://www.circuscircus.com/content/dam/caesars/circus-circus/home/hero-image.jpg\",\n      \"geoCoordinates\": \"36.1207, -115.1687\",\n      \"rating\": \"3 stars\",\n      \"description\": \"A classic Las Vegas hotel with a circus theme. It features a large casino, a midway with carnival rides, and several dining options.\"\n    },\n    {\n      \"hotelName\": \"Golden Nugget Las Vegas\",\n      \"hotelAddress\": \"129 E Fremont St, Las Vegas, NV 89101\",\n      \"price\": \"$70-$150 per night\",\n      \"hotelImageUrl\": \"https://www.goldennugget.com/las-vegas/media/images/gnl-home-hero-image-large.jpg\",\n      \"geoCoordinates\": \"36.1695, -115.1438\",\n      \"rating\": \"4 stars\",\n      \"description\": \"A luxurious hotel located in downtown Las Vegas. It features a world-class casino, a pool, and several dining options.\"\n    },\n    {\n      \"hotelName\": \"The Strat Hotel, Casino & SkyPod\",\n      \"hotelAddress\": \"2000 Las Vegas Blvd S, Las Vegas, NV 89104\",\n      \"price\": \"$60-$120 per night\",\n      \"hotelImageUrl\": \"https://www.thestrat.com/content/dam/caesars/strat/home/hero-image.jpg\",\n      \"geoCoordinates\": \"36.1708, -115.1498\",\n      \"rating\": \"3.5 stars\",\n      \"description\": \"A hotel located on the Strip with a towering observation deck. It features a casino, a pool, and several dining options.\"\n    }\n  ],\n  \"itinerary\": [\n    {\n      \"day\": \"Day 1\",\n      \"plan\": [\n        {\n          \"time\": \"9:00 AM - 12:00 PM\",\n          \"placeName\": \"Fremont Street Experience\",\n          \"placeDetails\": \"A pedestrian-friendly street in downtown Las Vegas with a canopy of lights and street performers. It's a great place to start your trip and get a feel for the city's energy.\",\n          \"placeImageUrl\": \"https://www.fremontstreetexperience.com/images/fremont-street-experience/fremont-street-experience.jpg\",\n          \"geoCoordinates\": \"36.1695, -115.1438\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"1 hour\"\n        },\n        {\n          \"time\": \"12:00 PM - 2:00 PM\",\n          \"placeName\": \"Heart Attack Grill\",\n          \"placeDetails\": \"A restaurant known for its outrageous burgers and unhealthy food. It's a fun and quirky experience, but not for the faint of heart.\",\n          \"placeImageUrl\": \"https://images.squarespace-cdn.com/content/v1/586a8df8d482e99d39a57355/1531782073544-72U1G36O9R2H0768F9Q0/ke17ZwdGBToddI8pDm48kG6yM4g8p9-eL87bY6v5O9gJoQ0-V0K4c1i0h64R22-84844192803768-6T7b93z38528_1.jpg\",\n          \"geoCoordinates\": \"36.1691, -115.1424\",\n          \"ticketPricing\": \"Varies\",\n          \"timeToTravel\": \"15 minutes\"\n        },\n        {\n          \"time\": \"2:00 PM - 4:00 PM\",\n          \"placeName\": \"Neon Museum\",\n          \"placeDetails\": \"A museum showcasing vintage neon signs from Las Vegas. It's a great way to learn about the city's history and see some iconic signs.\",\n          \"placeImageUrl\": \"https://www.neonmuseum.org/images/content/hero-neon-museum-02.jpg\",\n          \"geoCoordinates\": \"36.1722, -115.1465\",\n          \"ticketPricing\": \"$25\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"4:00 PM - 6:00 PM\",\n          \"placeName\": \"The LINQ Promenade\",\n          \"placeDetails\": \"An outdoor shopping and dining promenade on the Strip. It's a great place to people-watch and enjoy the atmosphere.\",\n          \"placeImageUrl\": \"https://www.caesars.com/content/dam/caesars/linq/home/hero-image.jpg\",\n          \"geoCoordinates\": \"36.1139, -115.1723\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"6:00 PM - 8:00 PM\",\n          \"placeName\": \"Dinner at a buffet\",\n          \"placeDetails\": \"Las Vegas is famous for its buffets, and there are many options to choose from at different price points.\",\n          \"placeImageUrl\": \"https://www.casino.com/blog/wp-content/uploads/2018/03/buffet.jpg\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"Varies\",\n          \"timeToTravel\": \"None\"\n        }\n      ]\n    },\n    {\n      \"day\": \"Day 2\",\n      \"plan\": [\n        {\n          \"time\": \"9:00 AM - 11:00 AM\",\n          \"placeName\": \"Hoover Dam\",\n          \"placeDetails\": \"A massive concrete arch-gravity dam on the Colorado River. It's a must-see for any visitor to Las Vegas.\",\n          \"placeImageUrl\": \"https://www.nps.gov/hoba/planyourvisit/images/Hoover-Dam-Panorama_Photo-by-Jeff-Moore_NPS.jpg\",\n          \"geoCoordinates\": \"36.0047, -114.9896\",\n          \"ticketPricing\": \"$30\",\n          \"timeToTravel\": \"1 hour 30 minutes\"\n        },\n        {\n          \"time\": \"11:00 AM - 1:00 PM\",\n          \"placeName\": \"Lake Mead National Recreation Area\",\n          \"placeDetails\": \"A vast recreation area surrounding Lake Mead, the largest reservoir in the United States.\",\n          \"placeImageUrl\": \"https://www.nps.gov/lake/learn/nature/images/lakemeadnra-boatlaunch.jpg\",\n          \"geoCoordinates\": \"36.0887, -114.8983\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"1:00 PM - 3:00 PM\",\n          \"placeName\": \"Lunch at a local diner\",\n          \"placeDetails\": \"There are many great diners in Las Vegas where you can enjoy a cheap and tasty lunch.\",\n          \"placeImageUrl\": \"https://www.restaurant.com/images/restaurants/29825/1/lg.jpg\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"Varies\",\n          \"timeToTravel\": \"None\"\n        },\n        {\n          \"time\": \"3:00 PM - 5:00 PM\",\n          \"placeName\": \"Bellagio Conservatory & Botanical Garden\",\n          \"placeDetails\": \"A stunning botanical garden located inside the Bellagio Hotel. It's a free attraction and a great place to relax.\",\n          \"placeImageUrl\": \"https://www.bellagio.com/content/dam/mgmresorts/bellagio/images/conservatory/conservatory-hero-mobile.jpg\",\n          \"geoCoordinates\": \"36.1101, -115.1747\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"5:00 PM - 7:00 PM\",\n          \"placeName\": \"Fountains of Bellagio\",\n          \"placeDetails\": \"A spectacular water and light show that takes place every 15 minutes in front of the Bellagio Hotel. It's a free attraction and a must-see.\",\n          \"placeImageUrl\": \"https://www.bellagio.com/content/dam/mgmresorts/bellagio/images/fountains/fountains-hero-mobile.jpg\",\n          \"geoCoordinates\": \"36.1101, -115.1747\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"None\"\n        },\n        {\n          \"time\": \"7:00 PM - 9:00 PM\",\n          \"placeName\": \"Dinner at a casual restaurant\",\n          \"placeDetails\": \"There are many casual restaurants on the Strip and in downtown Las Vegas where you can enjoy a cheap and delicious meal.\",\n          \"placeImageUrl\": \"https://www.tripadvisor.com/Tourism-g45963-Las_Vegas-Vacations.html\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"Varies\",\n          \"timeToTravel\": \"None\"\n        }\n      ]\n    },\n    {\n      \"day\": \"Day 3\",\n      \"plan\": [\n        {\n          \"time\": \"9:00 AM - 11:00 AM\",\n          \"placeName\": \"Red Rock Canyon National Conservation Area\",\n          \"placeDetails\": \"A scenic desert landscape with hiking trails and rock formations.\",\n          \"placeImageUrl\": \"https://www.nps.gov/redr/learn/nature/images/Red-Rock-Canyon-Landscape-photo-by-Jeff-Moore_NPS.jpg\",\n          \"geoCoordinates\": \"36.1791, -115.2551\",\n          \"ticketPricing\": \"$15 per car\",\n          \"timeToTravel\": \"45 minutes\"\n        },\n        {\n          \"time\": \"11:00 AM - 1:00 PM\",\n          \"placeName\": \"Lunch at a picnic area\",\n          \"placeDetails\": \"Enjoy a picnic lunch at one of the many picnic areas in Red Rock Canyon.\",\n          \"placeImageUrl\": \"https://www.nps.gov/redr/planyourvisit/images/Red-Rock-Canyon-Picnic-Area.jpg\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"None\",\n          \"timeToTravel\": \"None\"\n        },\n        {\n          \"time\": \"1:00 PM - 3:00 PM\",\n          \"placeName\": \"High Roller Observation Wheel\",\n          \"placeDetails\": \"A giant observation wheel on the Strip that offers stunning views of the city. It's a great way to end your trip.\",\n          \"placeImageUrl\": \"https://www.thelinq.com/content/dam/caesars/linq/home/high-roller/high-roller-hero-image.jpg\",\n          \"geoCoordinates\": \"36.1123, -115.1729\",\n          \"ticketPricing\": \"$30\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"3:00 PM - 5:00 PM\",\n          \"placeName\": \"Shopping at the Outlets\",\n          \"placeDetails\": \"There are several outlet malls in Las Vegas where you can find great deals on designer clothes and other goods.\",\n          \"placeImageUrl\": \"https://www.premiumoutlets.com/wp-content/uploads/2015/09/north-las-vegas-outlet-center-1.jpg\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"Free\",\n          \"timeToTravel\": \"30 minutes\"\n        },\n        {\n          \"time\": \"5:00 PM - 7:00 PM\",\n          \"placeName\": \"Dinner at a food truck park\",\n          \"placeDetails\": \"There are several food truck parks in Las Vegas where you can find a variety of cuisines at affordable prices.\",\n          \"placeImageUrl\": \"https://images.squarespace-cdn.com/content/v1/5f3c60c0db41146490e48d9d/1597456116808-Z1N9N7Z0055N04R8W5T1/ke17ZwdGBToddI8pDm48kG6yM4g8p9-eL87bY6v5O9gJoQ0-V0K4c1i0h64R22-84844192803768-6T7b93z38528_1.jpg\",\n          \"geoCoordinates\": \"None\",\n          \"ticketPricing\": \"Varies\",\n          \"timeToTravel\": \"None\"\n        }\n      ]\n    }\n  ]\n}\n```\n\n**Notes:**\n\n* This itinerary is just a suggestion and can be adjusted based on your interests and preferences.\n* Hotel prices are approximate and may vary depending on the season and availability.\n* You can find more information about each place, including reviews and directions, on websites like TripAdvisor, Yelp, and Google Maps.\n* It is always a good idea to book your flights and accommodation in advance, especially if you are traveling during peak season.\n* Be sure to bring comfortable shoes, sunscreen, and a hat, as you will be doing a lot of walking in the desert heat.\n\n**Enjoy your trip to Las Vegas!** \n"},
          ],
        },
      ],
    });
  
   
  
  
=======
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
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
