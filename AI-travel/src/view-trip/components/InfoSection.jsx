import { Button } from '@/components/ui/button'
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import '../../InfoSection.css'; // 🎯 Our dedicated styling arsenal

function InfoSection({ trip }) {
  // 🎮 GAME STATE - Track our photo loading adventure
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // 🚀 QUEST TRIGGER - When trip data arrives, start photo quest
  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  // 🎯 PHOTO QUEST FUNCTION - Enhanced with error handling
  const GetPlacePhoto = async () => {
    try {
      setPhotoLoading(true);
      setPhotoError(false);
      
      const data = {
        textQuery: trip?.userSelection?.location?.label
      };
      
      console.log('🔍 Searching for photos of:', data.textQuery);
      
      const result = await GetPlaceDetails(data);
      
      // 🛡️ SAFETY CHECK - Make sure we have photos before accessing them
      if (result?.data?.places?.[0]?.photos?.length > 0) {
        const photos = result.data.places[0].photos;
        
        // 🎲 SMART PHOTO SELECTION - Try different photos if one fails
        let selectedPhotoIndex = 0;
        
        // Prefer later photos (often better quality) but fallback to first
        if (photos.length > 3) {
          selectedPhotoIndex = 3;
        } else if (photos.length > 1) {
          selectedPhotoIndex = photos.length - 1;
        }
        
        const photoName = photos[selectedPhotoIndex]?.name;
        
        if (photoName) {
          const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
          console.log('📸 Photo URL generated:', PhotoUrl);
          setPhotoUrl(PhotoUrl);
        } else {
          throw new Error('Photo name not found');
        }
      } else {
        throw new Error('No photos available for this location');
      }
      
    } catch (error) {
      console.error('📸 Photo quest failed:', error);
      setPhotoError(true);
      // Keep photoUrl as null to show fallback
    } finally {
      setPhotoLoading(false);
    }
  };

  // 🎨 FALLBACK IMAGE COMPONENT - When photo quest fails
  const FallbackImage = () => (
    <div className="fallback-image">
      <div className="fallback-content">
        <div className="fallback-emoji">🏖️</div>
        <h3 className="fallback-title">
          {trip?.userSelection?.location?.label || 'Your Destination'}
        </h3>
        <p className="fallback-subtitle">Photo loading...</p>
      </div>
    </div>
  );

  // 🎮 LOADING STATE - Show shimmer while photo loads
  const LoadingImage = () => (
    <div className="loading-image">
      <div className="loading-content">
        <div className="loading-emoji">📷</div>
        <p className="loading-text">Loading photo...</p>
      </div>
    </div>
  );

  return (
    <div className="info-section">
      {/* 🖼️ HERO IMAGE SECTION - Smart fallbacks for bulletproof experience */}
      <div className="hero-image-container">
        {photoLoading ? (
          <LoadingImage />
        ) : photoUrl && !photoError ? (
          <img 
            src={photoUrl} 
            className="hero-image"
            alt={`Beautiful view of ${trip?.userSelection?.location?.label}`}
            onError={() => {
              console.log('📸 Image failed to load, showing fallback');
              setPhotoError(true);
            }}
          />
        ) : (
          <FallbackImage />
        )}
      </div>

      {/* 📋 TRIP INFO SECTION - Clean and organized */}
      <div className="trip-info-header">
        <div className="trip-details-container">
          {/* 🏷️ DESTINATION TITLE */}
          <h2 className="destination-title">
            {trip?.userSelection?.location?.label || 'Your Amazing Trip'}
          </h2>
          
          {/* 🏷️ TRIP DETAILS BADGES - Desktop version */}
          <div className="trip-badges-desktop">
            {trip?.userSelection?.noOfDays && (
              <span className="trip-badge">
                📅 {trip.userSelection.noOfDays} {trip.userSelection.noOfDays === 1 ? 'Day' : 'Days'}
              </span>
            )}
            
            {trip?.userSelection?.budget && (
              <span className="trip-badge">
                💰 {trip.userSelection.budget} Budget
              </span>
            )}
            
            {trip?.userSelection?.traveler && (
              <span className="trip-badge">
                🥂 {trip.userSelection.traveler}
              </span>
            )}
          </div>

          {/* 📱 MOBILE VERSION - Compact info for small screens */}
          <div className="trip-info-mobile">
            {trip?.userSelection?.noOfDays && (
              <span className="mobile-info-item">
                📅 {trip.userSelection.noOfDays} {trip.userSelection.noOfDays === 1 ? 'Day' : 'Days'}
              </span>
            )}
            {trip?.userSelection?.budget && (
              <span className="mobile-info-item">
                💰 {trip.userSelection.budget}
              </span>
            )}
            {trip?.userSelection?.traveler && (
              <span className="mobile-info-item">
                🥂 {trip.userSelection.traveler}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;