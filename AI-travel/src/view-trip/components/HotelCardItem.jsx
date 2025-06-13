import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../hotels.css'; 

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel])

  const GetPlacePhoto = async () => {
    if (!hotel?.hotelName) {
      setLoading(false);
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const data = {
        textQuery: hotel?.hotelName
      }

      console.log('🔍 Searching for hotel:', hotel.hotelName);

      const result = await GetPlaceDetails(data);
      
      if (result?.data?.places && result.data.places.length > 0) {
        const placeData = result.data.places[0];

        // 🛡️ SAFE photo access with multiple fallbacks (FIXED!)
        let photoUrl = null;
        if (placeData.photos && Array.isArray(placeData.photos) && placeData.photos.length > 0) {
          // Try different photo indices - no more crashes!
          const photoIndices = [3, 0, 1, 2, 4, 5];
          
          for (const index of photoIndices) {
            if (placeData.photos[index] && placeData.photos[index].name) {
              photoUrl = PHOTO_REF_URL.replace('{NAME}', placeData.photos[index].name);
              console.log(`✅ Found hotel photo at index ${index}:`, photoUrl);
              break;
            }
          }
        }

        setPhotoUrl(photoUrl);
        console.log('✅ Hotel photo loaded for:', hotel.hotelName);
      } else {
        console.warn('⚠️ No hotel data found for:', hotel.hotelName);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading hotel photo:', error);
      setError(true);
      setLoading(false);
    }
  }

  // 🎯 Safe hotel image component with loading states
  const SafeHotelImage = () => {
    const [imageError, setImageError] = useState(false);

    if (loading) {
      return <div className="hotel-image-loading"></div>;
    }

    if (error || !photoUrl || imageError) {
      return (
        <img 
          src='/placeholder.jpg' 
          alt={`${hotel?.hotelName || 'Hotel'} placeholder`}
          className='hotel-image'
        />
      );
    }

    return (
      <img 
        src={photoUrl} 
        alt={`${hotel?.hotelName || 'Hotel'} photo`}
        className='hotel-image'
        onError={() => setImageError(true)}
        onLoad={() => console.log('✅ Hotel image loaded:', hotel.hotelName)}
      />
    );
  };

  return (
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ', ' + (hotel?.hotelAddress || ''))}`} 
      target='_blank'
      className="hotel-card-link"
    >
      <div className={`hotel-card-container ${loading ? 'hotel-loading' : ''}`}>
        <SafeHotelImage />
        
        <div className='hotel-info'>
          <h2 className='hotel-name'>{hotel?.hotelName || 'Hotel Name Not Available'}</h2>
          <h2 className='hotel-address'>📍 {hotel?.hotelAddress || 'Address not available'}</h2>
          <h2 className='hotel-price'>💰 {hotel?.price || 'Price not available'}</h2>
          <h2 className='hotel-rating'>⭐ {hotel?.rating || 'No rating'}</h2>
        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem