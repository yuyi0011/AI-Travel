import axios from "axios"

<<<<<<< HEAD
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

// 🚀 Enhanced configuration for rich Google Places data
const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        // 🎯 Enhanced field mask to get rich place data
        'X-Goog-FieldMask': [
            // Basic info (included in base cost)
            'places.photos',
            'places.displayName',
            'places.id',
            'places.formattedAddress',
            'places.businessStatus',
            
            // Contact & Hours ($3 per 1000 requests)
            'places.websiteUri',
            'places.regularOpeningHours',
            'places.currentOpeningHours',
            
            // Quality & Reviews ($5 per 1000 requests)
            'places.rating',
            'places.userRatingCount',
            'places.priceLevel',
            'places.editorialSummary',
            'places.reviews'
        ].join(',')
    }
}

// Your enhanced GetPlaceDetails function
export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config)

// Photo URL template (your existing one)
export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY
=======
const BASE_URL='https://places.googleapis.com/v1/places:searchText'

const config={
    headers:{
        'Content-Type':'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask':[
            'places.photos',
            'places.displayName',
            'places.id'
        ]
    }
}

export const GetPlaceDetails=(data)=>axios.post(BASE_URL,data,config)

export const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
