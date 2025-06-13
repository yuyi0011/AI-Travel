import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  console.log("🌍 UNIVERSAL PLACES COMPONENT LOADED");
  console.log("Trip data:", trip?.tripData);
  
  const itineraryData = trip?.tripData?.itinerary;
  
  if (!itineraryData || !Array.isArray(itineraryData)) {
    return (
      <div>
        <h2 className='font-bold text-lg'>Places to Visit</h2>
        <p className='text-gray-500 mt-4'>Planning your amazing itinerary...</p>
      </div>
    );
  }

  // 🧠 SMART UNIVERSAL DATA EXTRACTOR
  const extractPlacesFromDay = (dayItem, dayIndex) => {
    const places = [];
    
    console.log(`🔍 Analyzing Day ${dayIndex + 1}:`, dayItem);
    
    // PATTERN 1: Budapest/London style - item.plan (direct array)
    if (Array.isArray(dayItem?.plan)) {
      console.log(`📍 Pattern 1: Direct plan array (${dayItem.plan.length} items)`);
      dayItem.plan.forEach((place, index) => {
        places.push({
          key: `plan-${dayIndex}-${index}`,
          placeName: place.placeName || place.name || `Place ${index + 1}`,
          placeDetails: place.placeDetails || place.description || 'Explore this destination',
          timeToTravel: place.duration || place.time || 'Visit duration varies',
          ticketPricing: place.ticketPricing || place.price || 'Check locally',
          bestTimeToVisit: place.bestTimeToVisit,
          geoCoordinates: place.geoCoordinates,
          travelTip: place.travelTip,
          foodRecommendation: place.foodRecommendation,
          source: 'plan-array'
        });
      });
    }
    
    // PATTERN 2: Dali style - item.plan.placesToVisit (nested object)
    if (dayItem?.plan?.placesToVisit && Array.isArray(dayItem.plan.placesToVisit)) {
      console.log(`📍 Pattern 2: Nested plan.placesToVisit (${dayItem.plan.placesToVisit.length} items)`);
      dayItem.plan.placesToVisit.forEach((place, index) => {
        places.push({
          key: `nested-place-${dayIndex}-${index}`,
          placeName: place.placeName || place.name || `Place ${index + 1}`,
          placeDetails: place.placeDetails || place.description || 'Explore this destination',
          timeToTravel: place.travelTime || place.duration || 'Half day visit',
          ticketPricing: place.ticketPricing || place.price || 'Check locally',
          bestTimeToVisit: place.bestTimeToVisit,
          geoCoordinates: place.geoCoordinates,
          travelTip: place.travelTips,
          foodRecommendation: place.foodToEat?.[0],
          source: 'plan.placesToVisit'
        });
        
        // Add activities from this place
        if (place.thingsToDo && Array.isArray(place.thingsToDo)) {
          place.thingsToDo.forEach((activity, activityIndex) => {
            places.push({
              key: `nested-activity-${dayIndex}-${index}-${activityIndex}`,
              placeName: `${place.placeName} Activity`,
              placeDetails: activity,
              timeToTravel: '1-2 hours',
              ticketPricing: 'Included',
              source: 'plan.placesToVisit.thingsToDo'
            });
          });
        }
      });
    }
    
    // PATTERN 3: Tibet style - item.placesToVisit (root level)
    if (dayItem?.placesToVisit && Array.isArray(dayItem.placesToVisit)) {
      console.log(`📍 Pattern 3: Root placesToVisit (${dayItem.placesToVisit.length} items)`);
      dayItem.placesToVisit.forEach((place, index) => {
        places.push({
          key: `root-place-${dayIndex}-${index}`,
          placeName: typeof place === 'string' ? place : place.placeName || place.name,
          placeDetails: typeof place === 'string' ? `Visit ${place}` : place.placeDetails || place.description,
          timeToTravel: '2-3 hours',
          ticketPricing: dayItem?.ticketPrices?.[place] || 'Check locally',
          source: 'placesToVisit'
        });
      });
    }
    
    // PATTERN 4: Tibet activities - item.thingsToDo
    if (dayItem?.thingsToDo && Array.isArray(dayItem.thingsToDo)) {
      console.log(`📍 Pattern 4: Root thingsToDo (${dayItem.thingsToDo.length} items)`);
      dayItem.thingsToDo.forEach((activity, index) => {
        places.push({
          key: `root-activity-${dayIndex}-${index}`,
          placeName: 'Activity',
          placeDetails: activity,
          timeToTravel: '1-2 hours',
          ticketPricing: 'Usually included',
          source: 'thingsToDo'
        });
      });
    }
    
    // PATTERN 5: Alternative structures - places, attractions, activities, destinations
    ['places', 'attractions', 'activities', 'destinations', 'locations'].forEach(key => {
      if (dayItem?.[key] && Array.isArray(dayItem[key])) {
        console.log(`📍 Pattern 5: ${key} (${dayItem[key].length} items)`);
        dayItem[key].forEach((place, index) => {
          places.push({
            key: `${key}-${dayIndex}-${index}`,
            placeName: typeof place === 'string' ? place : place.placeName || place.name || place.title,
            placeDetails: typeof place === 'string' ? `Experience ${place}` : place.placeDetails || place.description || place.details,
            timeToTravel: place.timeToTravel || place.duration || '1-3 hours',
            ticketPricing: place.ticketPricing || place.price || place.cost || 'Check locally',
            source: key
          });
        });
      }
    });
    
    console.log(`✅ Day ${dayIndex + 1} extracted ${places.length} places from sources:`, [...new Set(places.map(p => p.source))]);
    return places;
  };

  // 🍽️ SMART FOOD EXTRACTOR
  const extractFoodFromDay = (dayItem, dayIndex) => {
    const foods = [];
    
    // From plan array items (Budapest/London style)
    if (Array.isArray(dayItem?.plan)) {
      dayItem.plan.forEach((place, placeIndex) => {
        if (place?.foodRecommendation) {
          foods.push({
            key: `plan-food-${dayIndex}-${placeIndex}`,
            placeName: `${place.placeName} Cuisine`,
            placeDetails: place.foodRecommendation,
            timeToTravel: '30-60 min',
            ticketPricing: 'Local pricing'
          });
        }
      });
    }
    
    // From nested structure (Dali style)
    if (dayItem?.plan?.placesToVisit) {
      dayItem.plan.placesToVisit.forEach((place, placeIndex) => {
        if (place?.foodToEat && Array.isArray(place.foodToEat)) {
          place.foodToEat.forEach((food, foodIndex) => {
            foods.push({
              key: `nested-food-${dayIndex}-${placeIndex}-${foodIndex}`,
              placeName: `${place.placeName} Cuisine`,
              placeDetails: food,
              timeToTravel: '30-60 min',
              ticketPricing: 'Local pricing'
            });
          });
        }
      });
    }
    
    // From root level (Tibet style)
    if (dayItem?.foodToEat && Array.isArray(dayItem.foodToEat)) {
      dayItem.foodToEat.forEach((food, index) => {
        foods.push({
          key: `root-food-${dayIndex}-${index}`,
          placeName: 'Local Cuisine',
          placeDetails: food,
          timeToTravel: '30-60 min',
          ticketPricing: 'Budget friendly'
        });
      });
    }
    
    return foods;
  };

  return (
    <div>
      <h2 className='font-bold text-lg'>Places to Visit</h2>
      <p className="text-sm text-blue-600 mb-4">
        🌍 Exploring {trip?.tripData?.location || trip?.userSelection?.destination || 'your destination'} over {itineraryData.length} days
      </p>
    
      <div>
        {itineraryData.map((item, index) => {
          const placesToShow = extractPlacesFromDay(item, index);
          const foodToShow = extractFoodFromDay(item, index);
          
          return (
            <div key={`day-${index}`} className='mt-6'>
              
              {/* Universal Day Header */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                <h2 className='font-bold text-xl text-blue-800'>{item?.day || `Day ${index + 1}`}</h2>
                {item?.theme && (
                  <p className="text-purple-600 mt-1 font-medium">🎨 {item.theme}</p>
                )}
                {item?.plan?.bestTimeToVisit && (
                  <p className="text-green-600 mt-1 text-sm">⏰ Best time: {item.plan.bestTimeToVisit}</p>
                )}
                
                {/* Debug info */}
                <p className="text-xs text-gray-500 mt-1">
                  Found {placesToShow.length} places | Sources: {[...new Set(placesToShow.map(p => p.source))].join(', ') || 'None'}
                </p>
              </div>
              
              {/* Places Grid */}
              {placesToShow.length > 0 ? (
                <div className='grid md:grid-cols-2 gap-5'>
                  {placesToShow.map((place) => (
                    <div key={place.key}>
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-700">
                    🔍 No places found for {item?.day}. Available keys: {Object.keys(item).join(', ')}
                  </p>
                  {item.plan && (
                    <p className="text-yellow-600 text-sm mt-1">
                      Plan type: {typeof item.plan} | Is Array: {Array.isArray(item.plan) ? 'Yes' : 'No'}
                      {item.plan && typeof item.plan === 'object' && !Array.isArray(item.plan) && 
                        ` | Plan keys: ${Object.keys(item.plan).join(', ')}`
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Food Section */}
              {foodToShow.length > 0 && (
                <div className='mt-6'>
                  <h3 className='font-bold text-orange-600 mb-3'>🍽️ Local Food & Dining</h3>
                  <div className='grid md:grid-cols-2 gap-3'>
                    {foodToShow.map((food) => (
                      <div key={food.key}>
                        <PlaceCardItem place={food} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Tips Section */}
              {(item?.travelTips || placesToShow.some(p => p.travelTip)) && (
                <div className='mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400'>
                  <h3 className='font-bold text-amber-800 mb-3'>💡 Travel Tips</h3>
                  <div className='space-y-2'>
                    {/* Root level tips */}
                    {item?.travelTips && (
                      Array.isArray(item.travelTips) ? 
                        item.travelTips.map((tip, tipIndex) => (
                          <div key={`root-tip-${tipIndex}`} className='flex items-start'>
                            <span className='text-amber-600 mr-2 mt-1'>•</span>
                            <span className='text-amber-700 text-sm'>{tip}</span>
                          </div>
                        )) :
                        <div className='flex items-start'>
                          <span className='text-amber-600 mr-2 mt-1'>•</span>
                          <span className='text-amber-700 text-sm'>{item.travelTips}</span>
                        </div>
                    )}
                    
                    {/* Place-specific tips */}
                    {placesToShow.filter(p => p.travelTip).map((place, tipIndex) => (
                      <div key={`place-tip-${tipIndex}`} className='flex items-start'>
                        <span className='text-amber-600 mr-2 mt-1'>•</span>
                        <span className='text-amber-700 text-sm'>
                          <strong>{place.placeName}:</strong> {place.travelTip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {/* Universal Trip Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 text-lg mb-2">
            🌍 Your {trip?.userSelection?.destination || 'Travel'} Adventure Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-purple-600 text-xl">{itineraryData.length}</div>
              <div className="text-purple-500">Days</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600 text-xl">
                {itineraryData.reduce((total, day) => {
                  const dayPlaces = extractPlacesFromDay(day, 0);
                  return total + dayPlaces.length;
                }, 0)}
              </div>
              <div className="text-blue-500">Places to Visit</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600 text-xl">
                {trip?.userSelection?.traveler || 'Travelers'}
              </div>
              <div className="text-green-500">Group Size</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlacesToVisit