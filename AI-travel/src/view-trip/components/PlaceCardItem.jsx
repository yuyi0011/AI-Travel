import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
// Import CSS file - adjust path based on your file location
import '../../places.css'; // If places.css is in src folder

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [enhancedData, setEnhancedData] = useState({
    rating: null,
    userRatingCount: null,
    isOpenNow: null,
    businessStatus: null,
    website: null,
    editorialSummary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place])

  const GetPlacePhoto = async () => {
    if (!place?.placeName) {
      setLoading(false);
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const data = {
        textQuery: place.placeName
      }

      console.log('🔍 Searching for place:', place.placeName);

      const result = await GetPlaceDetails(data);

      if (result?.data?.places && result.data.places.length > 0) {
        const placeData = result.data.places[0];

        // 🛡️ SAFE photo access with multiple fallbacks
        let photoUrl = null;
        if (placeData.photos && Array.isArray(placeData.photos) && placeData.photos.length > 0) {
          // Try different photo indices
          const photoIndices = [0, 1, 2, 3, 4, 5]; // Start with 0 for most reliable
          
          for (const index of photoIndices) {
            if (placeData.photos[index] && placeData.photos[index].name) {
              photoUrl = PHOTO_REF_URL.replace('{NAME}', placeData.photos[index].name);
              console.log(`✅ Found photo at index ${index} for ${place.placeName}`);
              break;
            }
          }
        }

        // 🚀 Extract enhanced data from Google API
        setEnhancedData({
          rating: placeData.rating || null,
          userRatingCount: placeData.userRatingCount || null,
          isOpenNow: placeData.regularOpeningHours?.openNow || placeData.currentOpeningHours?.openNow || null,
          businessStatus: placeData.businessStatus || null,
          website: placeData.websiteUri || null,
          editorialSummary: placeData.editorialSummary?.text || null
        });

        setPhotoUrl(photoUrl);
        console.log(`✅ Enhanced data loaded for: ${place.placeName}`);
      } else {
        console.warn(`⚠️ No place data found for: ${place.placeName}`);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading place data:', error);
      setError(true);
      setLoading(false);
    }
  }

  // 🎯 Smart display functions
  const getDisplayDescription = () => {
    return enhancedData.editorialSummary || place.placeDetails || 'Explore this amazing destination';
  };

  const getOpeningStatus = () => {
    if (enhancedData.isOpenNow === true) return '🟢 Open Now';
    if (enhancedData.isOpenNow === false) return '🔴 Closed';
    return '';
  };

  // 🛡️ Safe image component
  const SafePlaceImage = () => {
    const [imageError, setImageError] = useState(false);

    // Show loading state
    if (loading) {
      return (
        <div className="place-image-loading">
          <div className="place-image-skeleton">
            <span className="loading-text">Loading...</span>
          </div>
        </div>
      );
    }

    // Show placeholder if error or no photo
    if (error || !photoUrl || imageError) {
      return (
        <img
          src='/placeholder.jpg'
          className='place-image'
          alt={`${place?.placeName || 'Place'} placeholder`}
        />
      );
    }

    // Show actual photo
    return (
      <img
        src={photoUrl}
        className='place-image'
        alt={place.placeName}
        onError={() => setImageError(true)}
        onLoad={() => console.log(`✅ Image loaded: ${place.placeName}`)}
      />
    );
  };

  // 🔗 Universal Google Maps URL
  const createMapsUrl = () => {
    if (!place?.placeName) return '#';
    
    // Use GPS coordinates if available (most accurate)
    if (place.geoCoordinates) {
      const coords = place.geoCoordinates.replace(/[°\s]/g, '').split(',');
      if (coords.length === 2) {
        const lat = coords[0].trim();
        const lng = coords[1].trim();
        return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
      }
    }
    
    // Fallback to place name search
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`;
  };

  return (
    <Link to={createMapsUrl()} target='_blank' className="place-card-link">
      <div className='place-card-container'>

        <SafePlaceImage />

        <div className="place-content">
          {/* Header with Rating */}
          <div className="place-header">
            <h2 className='place-title'>{place.placeName}</h2>
            {enhancedData.rating && (
              <div className="rating-badge">
                <span className="rating-text">
                  ⭐ {enhancedData.rating}
                  {enhancedData.userRatingCount && (
                    <span className="rating-count">({enhancedData.userRatingCount.toLocaleString()})</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className='place-description'>{getDisplayDescription()}</p>

          {/* Time & Best Time */}
          <div className="time-info-row">
            <span className="time-badge">🕙 {place.timeToTravel}</span>
            {place.bestTimeToVisit && (
              <span className="best-time-badge">⏰ {place.bestTimeToVisit}</span>
            )}
            {getOpeningStatus() && (
              <span className={`status-badge ${enhancedData.isOpenNow ? 'status-open' : 'status-closed'}`}>
                {getOpeningStatus()}
              </span>
            )}
          </div>

          {/* Pricing & Status */}
          <div className="pricing-info-row">
            <span className="price-badge">🎟️ {place.ticketPricing}</span>
            {enhancedData.businessStatus === 'OPERATIONAL' && (
              <span className="operating-badge">✅ Operating</span>
            )}
          </div>

          {/* Travel Tip */}
          {place.travelTip && (
            <div className="travel-tip">
              <span className="tip-label">💡 Tip:</span>
              <span className="tip-text">{place.travelTip}</span>
            </div>
          )}

          {/* Food Recommendation */}
          {place.foodRecommendation && (
            <div className="food-recommendation">
              <span className="food-label">🍽️ Food:</span>
              <span className="food-text">{place.foodRecommendation}</span>
            </div>
          )}

          {/* Website Link */}
          {enhancedData.website && (
            <div className="website-link">
              <a
                href={enhancedData.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                🌐 Official Website
              </a>
            </div>
          )}

          {/* Source & GPS (debug info) */}
          <div className="debug-info">
            {place.source && <span>📊 {place.source}</span>}
            {place.geoCoordinates && <span>📍 {place.geoCoordinates}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem