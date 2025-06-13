import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../../UserTripCardItem.css'  // 🎯 Our dedicated styling toolkit

function UserTripCardItem({trip}) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async() => {
    const data = {
      textQuery: trip?.userSelection?.location?.label
    }
    
    const result = await GetPlaceDetails(data).then(resp => {
      console.log(resp.data.places[0].photos[3].name);
      
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    })
  }

  return (
    <Link to={'/view-trip/' + trip?.id} className="trip-card-link">
      <div className='trip-card'>
        <img 
          src={photoUrl ? photoUrl : '/placeholder.jpg'} 
          alt={`${trip?.userSelection?.location?.label} destination`}
          className="trip-image"
        />
        <div className="trip-info">
          <h2 className='trip-title'>
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className='trip-details'>
            {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  )
}

export default UserTripCardItem;