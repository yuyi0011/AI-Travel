<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

function CreateTrip() {
  // 🎯 RULE #1: ALL HOOKS MUST BE DECLARED FIRST - NO EXCEPTIONS!
  // Think of this as loading all your game characters before the battle starts
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Auth state management
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();

  // 🔥 Safe authentication check - this hook runs every render
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (userData && userData !== 'null' && userData !== 'undefined') {
          const parsedUser = JSON.parse(userData);
          
          if (parsedUser && parsedUser.email) {
            setUser(parsedUser);
            setAuthChecked(true);
            return;
          }
        }
        
        setAuthChecked(true);
        
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login') {
          toast.info('Please sign in to create a trip');
          navigate('/login', { replace: true });
        }
        
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        setAuthChecked(true);
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    };
    
    const timer = setTimeout(checkAuth, 200);
    return () => clearTimeout(timer);
  }, [navigate]);

  // 🎮 Google Login Hook - must be declared at component level
  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      GetUserProfile(codeResp);
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Login failed. Please try again.');
    }
  });

  // 🎯 RULE #2: CONDITIONAL RENDERING COMES AFTER ALL HOOKS
  // Now we can safely return different UI based on state
  
  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user after auth check, show nothing (redirect will happen)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  // 🛠️ Helper Functions - These are like your game's special abilities
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const OnGenerateTrip = async () => {
    try {
      // Quick user check without redirect
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        toast.error('Session expired. Please sign in again.');
        navigate('/login', { replace: true });
        return;
      }

      // Validate form data
      const validationErrors = [];
      
      if (!formData?.location?.label) {
        validationErrors.push('Location is missing');
      }
      if (!formData?.budget) {
        validationErrors.push('Budget is missing');
      }
      if (!formData?.traveler) {
        validationErrors.push('Traveler selection is missing');
      }
      if (!formData?.noOfDays) {
        validationErrors.push('Number of days is missing');
      }

      if (validationErrors.length > 0) {
        toast.error(`Please complete: ${validationErrors.join(', ')}`);
        return;
      }

      // Validate number of days
      const days = parseInt(formData?.noOfDays);
      
      if (isNaN(days) || days > 5 || days < 1) {
        toast.error("Please enter trip duration between 1-5 days");
        return;
      }
      
      setLoading(true);
      toast.info('Generating your travel plan... Please wait');
      
      let travelPrompt;
      
      if (AI_PROMPT) {
        const locationName = formData.location?.label;
        travelPrompt = AI_PROMPT
          .replace('{location}', locationName)
          .replace('{totalDays}', formData.noOfDays)
          .replace('{traveler}', formData.traveler)
          .replace('{budget}', formData.budget);
      } else {
        const locationName = formData.location?.label;
        travelPrompt = `Generate a detailed travel plan for ${days} days in ${locationName} for ${formData.traveler} with a ${formData.budget} budget.

Please respond with a valid JSON object containing:
1. Hotels recommendations with name, address, price, rating
2. Daily itinerary with places to visit, activities, timing
3. Include realistic costs and practical travel tips

Format as JSON only, no additional text.`;
      }
      
      if (!chatSession) {
        throw new Error('AI chat service is not initialized');
      }

      const result = await chatSession.sendMessage(travelPrompt);
      const aiResponse = result?.response?.text();
      
      if (!aiResponse || aiResponse.trim() === '') {
        throw new Error('No response received from AI service');
      }
      
      await SaveAiTrip(aiResponse);
      
    } catch (error) {
      console.error('Error in trip generation:', error);
      setLoading(false);
      toast.error('Error generating trip: ' + error.message);
    }
  }

  const SaveAiTrip = async (tripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      
      if (!user || !user.email) {
        throw new Error('User information missing. Please log in again.');
      }
      
      // Parse the AI response safely
      let parsedTripData;
      try {
        parsedTripData = JSON.parse(tripData);
      } catch (parseError) {
        parsedTripData = {
          rawResponse: tripData,
          error: 'JSON parse failed',
          timestamp: new Date().toISOString()
        };
      }

      // Create the document to save
      const tripDocument = {
        id: docId,
        userEmail: user.email,
        userName: user.name || 'Unknown User',
        userPicture: user.picture || null,
        userSelection: {
          location: formData.location,
          destination: formData.location?.label,
          noOfDays: formData.noOfDays,
          budget: formData.budget,
          traveler: formData.traveler
        },
        tripData: parsedTripData,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Save to Firebase
      await setDoc(doc(db, "AITrips", docId), tripDocument);
      
      setLoading(false);
      toast.success('Trip saved successfully!');
      
      // Navigate to view trip page
      navigate('/view-trip/' + docId);
      
    } catch (error) {
      console.error('Firebase save error:', error);
      setLoading(false);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Check Firebase security rules.');
      } else if (error.code === 'unavailable') {
        toast.error('Firebase unavailable. Check your internet connection.');
      } else {
        toast.error('Error saving trip: ' + error.message);
      }
    }
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setUser(resp.data);
      setOpenDialog(false);
      toast.success('Logged in successfully!');
      
      // Auto-generate trip after login
      OnGenerateTrip();
    }).catch((error) => {
      console.error('Error getting user profile:', error);
      toast.error('Error during login. Please try again.');
      setLoading(false);
    });
  }

  // 🎨 MAIN COMPONENT RENDER - The grand finale!
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Welcome back, <strong>{user.name}</strong>! Let's plan your next adventure.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { 
                setPlace(v); 
                handleInputChange('location', v);
              },
              placeholder: "Enter destination...",
              className: "w-full"
            }}
          />
          
          {formData?.location?.label && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              ✅ Selected: <strong>{formData.location.label}</strong>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          
          <Input 
            placeholder={'Enter number of days (1-5)'} 
            type="number" 
            min="1" 
            max="5"
            value={formData?.noOfDays || ''}
            onChange={(e) => {
              handleInputChange('noOfDays', e.target.value);
            }}
            className="w-full p-3 border rounded-lg text-lg"
          />
          
          {formData?.noOfDays && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              ✅ Selected: <strong>{formData.noOfDays} days</strong>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions?.map((item, index) => (
              <div key={index}
                onClick={() => {
                  handleInputChange('budget', item.title);
                }}
                className={`cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${formData?.budget === item.title ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                <h2 className='text-4xl text-center'>{item.icon}</h2>
                <h2 className='font-bold text-lg text-center'>{item.title}</h2>
                <h2 className='text-sm text-gray-500 text-center'>{item.desc}</h2>
              </div>
            ))}
          </div>
          
          {formData?.budget && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              ✅ Budget Selected: <strong>{formData.budget}</strong>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelesList?.map((item, index) => (
              <div key={index}
                onClick={() => {
                  handleInputChange('traveler', item.people);
                }}
                className={`cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${formData?.traveler === item.people ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                <h2 className='text-4xl text-center'>{item.icon}</h2>
                <h2 className='font-bold text-lg text-center'>{item.title}</h2>
                <h2 className='text-sm text-gray-500 text-center'>{item.desc}</h2>
              </div>
            ))}
          </div>
          
          {formData?.traveler && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              ✅ Travel Companion: <strong>{formData.traveler}</strong>
            </div>
          )}
        </div>
      </div>

      <div className='my-10 justify-end flex gap-4'>
        <Button
          disabled={loading}
          onClick={OnGenerateTrip}
          className={`px-8 py-3 text-white font-semibold rounded-lg transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-700 cursor-pointer'
          }`}>
          {loading ? (
            <div className="flex items-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Generating...
            </div>
          ) : (
            '🎯 Generate Trip'
          )}
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-lg">
              Sign In With Google
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Sign in to the App with Google authentication securely
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-6 pt-4">
            <img src="/logo.svg" alt="App Logo" className="h-16 w-auto" />
            
            <Button
              onClick={login}
              className="w-full flex gap-4 items-center justify-center py-3"
            >
              <FcGoogle className='h-7 w-7' />
              Sign In With Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTrip
=======
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelersList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';


function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({
    location: null,
    noOfDays: '',
    budget: '',
    traveler: ''
  });

  const handleInputChange = (name, value) => {
    //if(name=='noOfDays'&& value<5){
     // console.log('Please select less than 5 days');
     // return;}

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const OnGenerateTrip=async() => {
    if(formData?.noOfDays>60&&!formData?.location||!formData?.budget||!formData?.traveler)
      {
        toast("Please fill all the fields");
        return ;
      }
      const FINAL_PROMPT=AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget);
    console.log('Final Prompt:', FINAL_PROMPT);

    const result =await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
    }


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final form data:', formData);
    //  form submission logic
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-xl text-gray-500">
        Just provide some basic information, and our trip planner will help you!
      </p>

      <form onSubmit={handleSubmit} className="mt-20 space-y-10">
        {/* Destination Section */}
        <div>
          <h2 className="text-xl font-medium my-3">What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange('location', v);
              },
              placeholder: 'Search for a destination...',
              className: 'w-full'
            }}
          />
        </div>

        {/* Days Section */}
        <div>
          <h2 className="text-xl font-medium my-3">How many days are you planning to go?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            min="1"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            value={formData.noOfDays}
          />
        </div>

        {/* Budget Section */}
        <div>
          <h2 className="text-xl font-medium my-3">What is Your Budget?</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange('budget', item.title)}
                className={`option-box cursor-pointer p-4 rounded-lg hover:shadow-lg border transition-all ${
                  formData.budget === item.title&& 'shadow-lg'
                    ? 'border-black bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-bold text-lg mb-1">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers Section */}
        <div>
          <h2 className="text-xl font-medium my-3">Who do you plan to travel with?</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-5">
            {SelectTravelersList.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`option-box cursor-pointer p-4 rounded-lg border transition-all ${
                  formData.traveler === item.people&& 'shadow-lg border-black bg-primary/10'
                    //? 'border-primary bg-primary/10'
                    //: 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-bold text-lg mb-1">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 flex justify-end">
          <Button onClick={OnGenerateTrip}>Generate Trip</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateTrip;
>>>>>>> f50de0aa62746a1f5e723ec9f5b3e4e0a1f6f2fc
