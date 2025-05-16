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