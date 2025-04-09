import React, { useState, useEffect } from 'react';
import axios from "axios";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { fr } from 'date-fns/locale';
import { format } from "date-fns";
import UploadPhotos from "../AddPlaces/UploadPhotos";
import DisplayPhotos from "../AddPlaces/DisplayPhotos";

import * as api from "../../api/requester";
import { MdNightlightRound } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import { useParams } from "react-router-dom";
import SuccModal from '../modal/SuccModal';
import { Elements } from "@stripe/react-stripe-js";
import PaymentComponent from './PaymentComponent';
import ClipLoader from "react-spinners/ClipLoader";
import { IoAdd } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import imageCompression from 'browser-image-compression';
import BookingProgressModal from './BookingProgressModal';
axios.defaults.baseURL = "https://localhost:5000";
axios.defaults.withCredentials = true;

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://spanode.onrender.com";

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/uploads"
    : "https://spanode.onrender.com/uploads";

function Form({ stripePromise }) {
  const { placeId } = useParams();

  const [disabledDates, setDisabledDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [availableOptions, setAvailableOptions] = useState(['Après-midi', 'Nuit']);
  const [isBookedSlotsLoaded, setIsBookedSlotsLoaded] = useState(false);
  const [errorDates, setErrorDates] = useState(null);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

  //FETCHING DATES 

  useEffect(() => {
    let isMounted = true;

    const fetchDates = async () => {
      try {
        const { fullyBookedDates, bookedSlots } = await api.fetchBookedDates(placeId);
        if (isMounted) {
          setDisabledDates(fullyBookedDates.map(date => new Date(date)));
          setBookedSlots(bookedSlots);
          setIsBookedSlotsLoaded(true); // Mark that bookedSlots is loaded
          setErrorDates(null); // Clear any previous error
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching booked dates:', err);
          setErrorDates('Failed to load booking data. Please try again.');
          setIsBookedSlotsLoaded(false); // Ensure loading state is reset on error

        }
      }
    };

    fetchDates();

    return () => {
      isMounted = false;
    };
  }, [placeId]);


  // Function to customize day content red & yellow dots 
  function customDayContent(day) {
    let extraDot = null;
    const formattedDate = format(day, "yyyy-MM-dd");
    const bookingsForDay = bookedSlots[formattedDate];

    if (bookingsForDay) {
      // Extract all time slots for the current date
      const timeSlots = bookingsForDay.map(booking => booking.timeSlot);

      if (timeSlots.includes("Nuit") && timeSlots.includes("Après-midi")) {
        // Fully booked (both slots booked)
        extraDot = (
          <div
            style={{
              height: "5px",
              width: "5px",
              borderRadius: "100%",
              background: "red",
              position: "absolute",
              top: 2,
              right: 2,
            }}
          />
        );
      } else {
        // Partially booked (one of the slots booked)
        extraDot = (
          <div
            style={{
              height: "5px",
              width: "5px",
              borderRadius: "100%",
              background: "#FFD700", // Yellow-Gold
              position: "absolute",
              top: 2,
              right: 2,
            }}
          />
        );
      }
    }

    return (
      <div>
        {extraDot}
        <span>{format(day, "d")}</span>
      </div>
    );
  }






  //SUCC MODAL MESSAGE
  const [msg, setMsg] = useState("");
  const [optionSucc, setOptionSucc] = useState(false);


  //DATES AND PLAN STATES
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [addedDates, setAddedDates] = useState([]);
  const [option, setOption] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [dayType, setDayType] = useState('');
  const [prices, setPrices] = useState({ night: 0, afternoon: 0 });

  //BOOKING DATA INFO STATES
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [nameTwo, setNameTwo] = useState('');
  const [familyNameTwo, setFamilyNameTwo] = useState('');
  const [emailTwo, setEmailTwo] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [cityTwo, setCityTwo] = useState('');
  const [postalCodeTwo, setPostalCodeTwo] = useState('');
  const [phoneTwo, setPhoneTwo] = useState('');
  const [total, setTotal] = useState('');
  const [uploadPhotos, setUploadPhotos] = useState([]);

  const [uploadPhotosPerson1, setUploadPhotosPerson1] = useState([]); // For first person
  const [uploadPhotosPerson2, setUploadPhotosPerson2] = useState([]); // For second person


  const [price, setPrice] = useState('');
  const [stepNum, setStepNum] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  //SHEETS 
  const [includeSheets, setIncludeSheets] = useState(false);


  const [planPrices, setPlanPrices] = useState({
    monthly: [95, 190],//190
    yearly: [230, 130],
  });
  const [addonPrices, setAddonPrices] = useState({
    monthly: [1, 2],
    yearly: [10, 20],
  });
  const [billingDuration, setBillingDuration] = useState('monthly');

  useEffect(() => {
    // Fetch initial plan and addon prices
    setPlanPrices({
      monthly: [95, 190],//95
      yearly: [230, 130],
    });
    setAddonPrices({
      monthly: [1, 2],
      yearly: [10, 20],
    });
  }, []);


  //BOXES LIST 
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]); // Now an array of selected box IDs


  //BOXES SELECTION FUNC - 

  const handleBoxChange = (selectedBox, index) => {

    if (promoApplied && boxes[index].name === "Love Box") {
      return; // Prevent unchecking the Love Box
    }


    setCheckedItems(prevState => {
      // If the box is already checked, uncheck it (remove it from the selected boxes)
      if (prevState[index]) {
        const newState = { ...prevState };
        delete newState[index]; // Remove this box from the selected list
        return newState;
      } else {
        // Otherwise, check the box by adding it to the selected boxes
        return { ...prevState, [index]: true };
      }
    });

    console.log(checkedItems);

  };
  //FETCH THE BOXES 
  useEffect(() => {
    // Fetch boxes on component mount
    const fetchBoxes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.getBoxes();
        setBoxes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);



  //COUPONS

  const [showPopup, setShowPopup] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert("Veuillez entrer un code promo.");
      return;
    }

    try {
      const response = await fetch(`${URL}/checkPromo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          promoCode: promoCode.trim().toUpperCase() // Normalize the code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de la validation du code promo");
      }

      if (data.valid) {
        const loveBox = boxes.find((box) => box.name === "Love Box");

        if (!loveBox) {
          throw new Error("Love Box n'est pas disponible dans la sélection actuelle");
        }

        console.log(loveBox);

        const loveBoxIndex = boxes.indexOf(loveBox);

        // Add the Love Box for free
        setCheckedItems((prevState) => ({
          ...prevState,
          [loveBoxIndex]: true, // Mark the Love Box as selected
        }));

        // Set the Love Box price to 0 (free)
        const updatedBoxes = boxes.map((box, index) => {
          if (index === loveBoxIndex) {
            return { ...box, price: 0 }; // Set price of Love Box to 0
          }
          return box;
        });

        // Update the boxes in state
        setBoxes(updatedBoxes);

        setPromoApplied(true);
        alert("Succès ! Love Box a été ajoutée gratuitement.");
      } else {
        alert(data.message || "Code promo invalide ou expiré");
      }
    } catch (error) {
      console.error("Erreur lors de l'application du code promo :", error);
      alert(error.message || "Une erreur est survenue lors de l'application du code promo");
    } finally {
      setShowPopup(false);
      setPromoCode("");
    }
  };




  // HANDLE NEXT BTN 

  const handleNext = async () => {
    // For step 1, validate the form
    if (stepNum === 1) {
      if (!validateStep1()) {
        return; // Don't proceed if validation fails
      }
    }

    // For step 2 validations remain unchanged.
    if (stepNum === 2) {
      if (!selectedPlan.name) {
        alert('Please select a plan.');
        return;
      }
      calculateTotal(); // Calculate the total when moving to the next step
    }

    // For step 4, trigger the booking request
    if (stepNum === 4) {
      setIsBooking(true); // Start booking process
      try {
        const bookingResult = await prepareBookingData(); // prepareBookingData sends the booking request and returns the booking data
        if (!bookingResult || !bookingResult._id) {
          alert("La réservation a échoué, veuillez réessayer.");
          return;
        }
        // If booking is successful,save bookingResult or proceed.
        setBookingId(bookingResult._id); // Store bookingId for Step 5
      } catch (error) {
        alert("La réservation a échoué, veuillez réessayer.");
        console.error(error);
        return;
      } finally {
        setIsBooking(false); // End booking process
      }
    }

    // If we are not on the last step (or after successful booking on step 4), proceed to the next step
    if (stepNum < 5) {
      setStepNum(prevStep => prevStep + 1);
    }
  };



  // HANDLE PREV BTN 

  const handlePrev = () => {
    if (stepNum > 0) {
      setStepNum(prevStep => prevStep - 1);
    }
  };

  // OPTION SELECTION FUNC  

  const handlePlanSelect = (plan) => {

    const { name, price } = plan;

    // Toggle the selected option
    if (option.includes(name)) {
      // If the option is already selected, remove it
      setOption(option.filter((Selectedoption) => Selectedoption !== name));
    } else {
      // If the option is not selected, add it
      setOption([...option, name]);
    }


    setSelectedPlan(plan);
    setPrice(plan.price);

  };


  //SUCC MSG MODAL

  const closeSuccModal = () => {
    setOptionSucc(false);
  };

  // BILL TOGGEL FUNC NO NEED FOR THE MOMENT 

  // const toggleBillingDuration = () => {
  //   const newDuration = billingDuration === 'monthly' ? 'yearly' : 'monthly';
  //   setBillingDuration(newDuration);
  // };


  // CALC TOTAL

  const calculateTotal = () => {
    let total = 0;

    // Add the prices of all selected boxes
    Object.keys(checkedItems).forEach((index) => {
      const box = boxes[index];
      if (box) {
        total += parseInt(box.price || 0);
      }
    });

    // Add the prices from the addedDates
    addedDates.forEach(({ options, prices }) => {
      options.forEach((option) => {
        if (option === "Nuit") {
          total += prices.night;
        } else if (option === "Après-midi") {
          total += prices.afternoon;
        }
      });
    });

    // Add the cost of sheets if selected
    if (includeSheets) {
      total += 20;
    }

    // Update the total state
    setTotal(total);
    return total;
  };


  // Recalculate total whenever selectedBox or addedDates changes
  useEffect(() => {
    calculateTotal();
  }, [checkedItems, addedDates, includeSheets]);

  // DATE SELECT AND GET THE POSSIBLE OPTIONS 
  const handleSelect = (ranges) => {
    setIsDateSelected(true); // Mark that a date has been selected
    // Reset the option array if the date changes
    setOption([]);
    // 1. Set the selected start and end dates
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.startDate);

    // 2. Determine the day type (weekday/weekend)
    determineDayType(ranges.selection.startDate);

    // 3. Get the selected date in the YYYY-MM-DD format
    const selectedDate = ranges.selection.startDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // 4. Check available time slots for the selected date
    let optionsLeft = ['Après-midi', 'Nuit']; // Start with all options

    if (bookedSlots[selectedDate]) {
      // Extract time slots for the selected date
      const bookedTimeSlots = bookedSlots[selectedDate].map(slot => slot.timeSlot);

      // Filter options based on already booked time slots
      optionsLeft = optionsLeft.filter(option => !bookedTimeSlots.includes(option));
    }

    // 5. Check already selected options for the selected date (from addedDates)
    const alreadySelectedOptions = addedDates
      .filter(addedDate => addedDate.date.toDateString() === ranges.selection.startDate.toDateString())
      .flatMap(addedDate => addedDate.options);

    // 6. Further filter options based on already selected options
    optionsLeft = optionsLeft.filter(option => !alreadySelectedOptions.includes(option));

    // 7. Update availableOptions state
    setAvailableOptions(optionsLeft);
  };

  // specialDates prices
  const specialDates = {
    "02-14": { dayType: "Valentine", prices: { night: 250, afternoon: 150 } },
    "03-06": { dayType: "Special Thursday", prices: { night: 150, afternoon: 95 } },   // Thursday, March 6
    "03-07": { dayType: "Special Friday", prices: { night: 150, afternoon: 125 } },   // Friday, March 7
    "03-08": { dayType: "Special Saturday", prices: { night: 150, afternoon: 125 } }, // Saturday, March 8
  };

  // DETERMINE THE DAY TYPE FUNC
  const determineDayType = (date) => {
    const day = date.getDay();
    const dateKey = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (specialDates[dateKey]) {
      const { dayType, prices } = specialDates[dateKey];
      setDayType(dayType);
      setPrices(prices);
    } else {
      const newDayType = day === 0 || day === 6 || day === 5 ? "Weekend" : "Jour de la semaine";
      setDayType(newDayType);
      calculatePrices(newDayType);
    }
  };

  // calculatePrices prices based on THE DAY TYPE FUNC
  const calculatePrices = (dayType) => {
    switch (dayType) {
      case "Weekend":
        setPrices({ night: 230, afternoon: 130 });
        break;
      case "Jour de la semaine":
        setPrices({ night: 190, afternoon: 95 });
        break;
      case "Valentine":
        setPrices({ night: 250, afternoon: 150 }); // Special prices for Valentine's Day
        break;
      case "Special Thursday": // Add support for new day types
      case "Special Friday":
      case "Special Saturday":
        // No need to set prices here; specialDates handles it
        break;
      default:
        setPrices({ night: 190, afternoon: 95 }); // Default to weekday prices
    }
  };





  // prepareBookingData FUNC 

  const prepareBookingData = async () => {
    // Adjust dates for timezone offset
    const adjustedDates = addedDates.map(({ date, options, prices }) => ({
      date: new Date(date.getTime() - date.getTimezoneOffset() * 60000),
      options,
      prices,
    }));

    // Ensure all required fields are filled
    if (!name || !familyName || !email || !phone || !addedDates || !total) {
      setError("Please complete all required fields before proceeding.");
      return null;
    }

    // Define compression options
    const compressionOptions = {
      maxSizeMB: 0.1, // Target ~100KB
      maxWidthOrHeight: 800, // Resize to 800px max
      initialQuality: 0.6, // 60% quality
      useWebWorker: true, // Faster compression
      fileType: 'image/jpeg', // Force JPEG output
    };

    // Function to compress images while keeping original format
    const compressImages = async (files) => {
      return Promise.all(
        files.map(async (file) => {
          if (file.size < 100 * 1024) { // Skip if smaller than 100KB
            return file;
          }
          try {
            const compressedFile = await imageCompression(file, compressionOptions);
            return compressedFile;
          } catch (error) {
            console.error("Compression error:", error);
            return file; // Fallback to original if compression fails
          }
        })
      );
    };

    // Step 1: Compress images for both persons
    let compressedPhotosPerson1 = await compressImages(uploadPhotosPerson1);
    let compressedPhotosPerson2 = await compressImages(uploadPhotosPerson2);

    // Step 2: Prepare FormData for uploading compressed images
    const formData = new FormData();
    compressedPhotosPerson1.forEach((file) => formData.append("photos", file));
    compressedPhotosPerson2.forEach((file) => formData.append("photos", file));

    // Step 3: Upload images to the server
    let uploadedImages;
    try {
      const response = await api.uploadPhotoFromDevice(formData);
      if (!response || !Array.isArray(response)) {
        throw new Error("Failed to upload files or response is invalid");
      }
      uploadedImages = response; // Assuming the API returns uploaded image URLs
    } catch (error) {
      console.error("Image Upload Error:", error.message);
      setError("Failed to upload images. Please try again.");
      return null;
    }

    // Step 4: Add metadata to each uploaded image
    const idPhotosPerson1 = uploadedImages
      .slice(0, uploadPhotosPerson1.length)
      .map((url) => ({ url, person: 1 }));
    const idPhotosPerson2 = uploadedImages
      .slice(uploadPhotosPerson1.length)
      .map((url) => ({ url, person: 2 }));

    // Combine images from both persons
    const idPhotos = [...idPhotosPerson1, ...idPhotosPerson2];

    // Collect selected box IDs
    const selectedBoxIds = Object.keys(checkedItems)
      .map((index) => boxes[index]?._id)
      .filter(Boolean); // Remove null values

    // Step 5: Consolidate all booking data
    const bookingData = {
      place: placeId,
      dates: adjustedDates,
      price: parseFloat(total),
      name,
      familyName,
      email,
      address,
      city,
      postalCode,
      phone,
      nameTwo,
      familyNameTwo,
      emailTwo,
      addressTwo,
      cityTwo,
      postalCodeTwo,
      phoneTwo,
      idPhotos,
      boxes: selectedBoxIds,
      includeSheets,
      total: parseFloat(total),
      paymentStatus: "pending",
    };

    // Step 6: Send booking data to backend
    try {
      const bookingResponse = await fetch(`${URL}/place/booking/${placeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking on the server");
      }

      const booking = await bookingResponse.json();
      if (!booking || !booking._id) {
        throw new Error("Invalid booking response from the server");
      }

      console.log("Booking created successfully:", booking);
      return booking;
    } catch (error) {
      console.error("Booking Creation Error:", error.message);
      setError("Failed to create the booking. Please try again.");
      return null;
    }
  };





  // handleAddDate FUNC 

  const handleAddDate = () => {
    // Ensure a date and at least one option are selected
    if (!startDate || option.length === 0) {
      alert("Veuillez sélectionner une date et au moins une option avant d'ajouter.");
      return;
    }

    // Build a date key in MM-DD format
    const dateKey = `${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;

    // Determine prices and day type based on special dates or regular logic
    let prices;
    let dayType;
    if (specialDates[dateKey]) {
      dayType = specialDates[dateKey].dayType;
      prices = specialDates[dateKey].prices;
    } else {
      const day = startDate.getDay();
      dayType = day === 0 || day === 5 || day === 6 ? 'Weekend' : 'Jour de la semaine';
      prices = dayType === 'Weekend'
        ? { night: 230, afternoon: 130 }
        : { night: 190, afternoon: 95 };
    }

    // Check if the selected date already exists in addedDates
    const existingDateIndex = addedDates.findIndex(
      (addedDate) => addedDate.date.toDateString() === startDate.toDateString()
    );

    if (existingDateIndex !== -1) {
      // If the date already exists, merge the options
      const updatedAddedDates = [...addedDates];
      const existingOptions = updatedAddedDates[existingDateIndex].options;
      option.forEach((newOption) => {
        if (!existingOptions.includes(newOption)) {
          existingOptions.push(newOption);
        }
      });
      setAddedDates(updatedAddedDates);
    } else {
      // If the date does not exist, add a new entry with the determined prices
      setAddedDates([
        ...addedDates,
        { date: startDate, options: option, prices },
      ]);
    }

    // Reset to allow selecting a new date
    setIsDateSelected(false);
    setStartDate(new Date());
    setOption([]);
  };



  //Delete selected date 
  const handleDeleteDate = (index) => {
    // Create a copy of addedDates and remove the entry at the specified index
    const updatedAddedDates = addedDates.filter((_, i) => i !== index);
    setAddedDates(updatedAddedDates);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: startDate,
    key: 'selection',
  };

  // STRIPE CODE

  const [clientSecret, setClientSecret] = useState("");
  const [bookingFeeClientSecret, setBookingFeeClientSecret] = useState(null);
  // const [securityDepositClientSecret, setSecurityDepositClientSecret] = useState(null);
  // const stripe = useStripe();
  // const elements = useElements();

  const [messageStripe, setMessageStripe] = useState(null);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorPayment, setErrorPayment] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (stepNum === 5) {
      // Fetch the client secret only when reaching the payment step
      const fetchClientSecret = async () => {
        try {
          const response = await axios.post(`${URL}/paymentIntentStripe`, {
            bookingFee: Math.round(total * 100), // Replace with your actual booking fee,
            // securityDeposit: Math.round(200 * 100),
            name: name, // Replace with the actual user's name from your state or props
            familyName: familyName, // Replace with the actual user's family name from your state or props
            email: email,// Replace with the actual user's email from your state or props
            bookingId: bookingId,
            promoApplied: promoApplied ? "true" : "false", // Note: metadata values are strings

          });
          setBookingFeeClientSecret(response.data.bookingFeeClientSecret);
          // setSecurityDepositClientSecret(response.data.securityDepositClientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error.response?.data?.error || error.message);
        }
      };

      fetchClientSecret();
    }
  }, [stepNum, total]);


  const appearance = {
    theme: "stripe",
  };


  const paymentElementOptions = {
    layout: "tabs",
  };


  // Scroll to top whenever stepNum changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepNum]);

  const validateStep1 = () => {
    const errors = {};

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First person validation
    if (!name.trim()) errors.name = "Le prénom est requis";
    if (!familyName.trim()) errors.familyName = "Le nom de famille est requis";
    if (!email.trim()) {
      errors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      errors.email = "Veuillez entrer un email valide";
    }
    if (!address.trim()) errors.address = "L'adresse est requise";
    if (!city.trim()) errors.city = "La ville est requise";
    if (!postalCode.trim()) errors.postalCode = "Le code postal est requis";
    if (!phone.trim()) errors.phone = "Le téléphone est requis";

    // Second person validation
    if (!nameTwo.trim()) errors.nameTwo = "Le prénom est requis";
    if (!familyNameTwo.trim()) errors.familyNameTwo = "Le nom de famille est requis";
    if (!emailTwo.trim()) {
      errors.emailTwo = "L'email est requis";
    } else if (!emailRegex.test(emailTwo)) {
      errors.emailTwo = "Veuillez entrer un email valide";
    }
    if (!addressTwo.trim()) errors.addressTwo = "L'adresse est requise";
    if (!cityTwo.trim()) errors.cityTwo = "La ville est requise";
    if (!postalCodeTwo.trim()) errors.postalCodeTwo = "Le code postal est requis";

    setValidationErrors(errors);

    // If there are errors, scroll to the top of the page
    if (Object.keys(errors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <main className="main">
        <div className="step__container">
          <div className="sidebar">
            {['CHOISIR VOTRE DATE', 'VOTRE INFO ', 'CHOISIR VOTRE BOX', "DRAPS SUPPLÉMENTAIRES", 'PAIEMENT'].map((step, index) => (
              <div className="step__indecater" key={index}>
                <div className={`indecater__num ${index === stepNum ? 'active' : ''}`}>{index + 1}</div>
                <div className="indecater__text">
                  <p className="subtitle">Étape {index + 1}</p>
                  <p className="mini__title">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="steps__container">
            {stepNum === 0 && (


              <form className="active" id="form" >
                <h3 className="main__title">Choisissez la Date et l'Heure</h3>
                <p className="description">
                  Choisissez une date et une option (Nuit, Après-midi), puis cliquez sur "Confirmer cette date". Répétez avec "Ajouter une autre date" pour plusieurs jours.

                </p>
                <ul className="list">
                  <li className="list__item clndrContainer">
                    <>
                      {!isBookedSlotsLoaded && (
                        <div className="loading-indicator">
                          <ClipLoader size={35} color="#161718" />
                        </div>
                      )}

                      {isBookedSlotsLoaded && (
                        <DateRangePicker
                          className="clndr"
                          staticRanges={[]}
                          inputRanges={[]}
                          direction="vertical"
                          ranges={[selectionRange]}
                          rangeColors={["#161718"]}
                          onChange={handleSelect}
                          moveRangeOnFirstSelection={false}
                          //!! BUG  IT ALWAYS DISPABEL THE PREV DATE
                          // disabledDates={disabledDates}
                          locale={fr} // Set the locale to French
                          dayContentRenderer={customDayContent} // Use custom day content
                        />
                      )}
                    </>
                  </li>

                  <p className="description">
                    Choix du {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>

                  {isDateSelected && (
                    <li className="list__item">
                      <div className="plan__card_container" id="plan-cards">
                        {availableOptions.length > 0 ? (
                          availableOptions.map((plan, index) => (
                            <div
                              key={index}
                              className={`plan__card card borderCard  ${option.includes(plan) ? 'selected' : ''
                                }`}
                              onClick={() =>
                                handlePlanSelect({
                                  name: plan,
                                  price: plan === 'Nuit' ? prices.night : prices.afternoon,
                                  duration: billingDuration === 'monthly' ? 'mo' : 'yr',
                                })
                              }
                            >
                              <div className="card__img">
                                <div className="time-range-container">
                                  <span>{plan === 'Nuit' ? '19:00 ' : '13:00'}</span>
                                  <div className="time-range-line"> à</div>
                                  <span>{plan === 'Nuit' ? '11:00' : '17:00'}</span>
                                </div>
                              </div>
                              <div className="plan__price">
                                <p className="card__name">
                                  <span className="flex items-center gap-2 w-[120px]"> {/* Fixed width for plan name */}
                                    {plan === 'Nuit' ? <MdNightlightRound className="Icon-DayNight" /> : <IoIosSunny className="Icon-DayNight" />}
                                    {plan}
                                  </span>

                                </p>
                              </div>

                              <span className="price-amount">
                                {plan === 'Nuit' ? `${prices.night}€` : `${prices.afternoon}€`}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="fully-booked-text">Cette date est complète. Aucun plan disponible.</p>
                        )}
                      </div>
                    </li>
                  )}

                  {/* Add Button (Conditional Rendering) */}
                  {isDateSelected && (
                    <button type="button" onClick={handleAddDate} className="add-date-button">
                      Confirmer cette date
                    </button>
                  )}

                  {/* Call-to-Action Button (When Dates Are Added) */}
                  {addedDates.length > 0 && !isDateSelected && (
                    <div onClick={() => setIsDateSelected(true)} className="add-another-date-button">
                      Ajouter une autre date  <IoAdd size={20} />
                    </div>
                  )}
                  <br />

                  {/* Render Added Dates Dynamically */}
                  {addedDates
                    .slice() // Create a shallow copy
                    .reverse() // Reverse the copy
                    .map(({ date, options, prices }, index) => (
                      <li className="list__item added__Dates p-4 bg-gray-100 rounded-lg shadow-sm " key={index}>
                        <p className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span
                            onClick={() => handleDeleteDate(addedDates.length - 1 - index)}
                            className="cursor-pointer hover:text-red-500"
                          >
                            <IoClose className='delete' size={15} />
                          </span>
                        </p>
                        <div className="plan__card_container list-dates " id="plan-cards">
                          {options.map((plan, idx) => (
                            <div
                              key={idx}
                              className={`plan__card card borderCard bg-gradient-to-r from-gray-200 to-gray-300`}
                            >
                              <div className="card__img">
                                <div className="time-range-container">
                                  <span>{plan === 'Nuit' ? '19:00 ' : '13:00'}</span>
                                  <div className="time-range-line"> à</div>
                                  <span>{plan === 'Nuit' ? '11:00' : '17:00'}</span>
                                </div>
                              </div>

                              <div className="plan__price">
                                <p className="card__name">
                                  <span className="flex items-center gap-2 w-[120px]"> {/* Fixed width for plan name */}
                                    {plan === 'Nuit' ? <MdNightlightRound className="Icon-DayNight" /> : <IoIosSunny className="Icon-DayNight" />}
                                    {plan}
                                  </span>

                                </p>
                              </div>

                              <span className="price-amount">
                                {plan === 'Nuit' ? `${prices.night}€` : `${prices.afternoon}€`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}

                </ul>
              </form>


            )}

            {stepNum === 1 && (
              <div className="step active" id="step-1">
                <h3 className="main__title">Informations personnelles</h3>
                <p className="description">
                  Veuillez fournir votre nom, votre adresse e-mail et votre numéro de téléphone. Téléchargez votre pièce d'identité pour les deux personnes
                </p>
                <ul className="list">
                  <li className="list__itemTwo">
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Prénom</p>
                        {validationErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="Nom"
                        className={`input ${validationErrors.name ? 'border-red-500' : ''}`}
                        placeholder="e.g. King"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Nom de famille</p>
                        {validationErrors.familyName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.familyName}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="Prenom"
                        className={`input ${validationErrors.familyName ? 'border-red-500' : ''}`}
                        placeholder="e.g. Stephen"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Email</p>
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    <input
                      type="email"
                      name="email"
                      className={`input ${validationErrors.email ? 'border-red-500' : ''}`}
                      placeholder="e.g. stephenking@lorem.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Address</p>
                      {validationErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      name="address"
                      className={`input ${validationErrors.address ? 'border-red-500' : ''}`}
                      placeholder="e.g. Lyon-55-street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__itemTwo">
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Ville</p>
                        {validationErrors.city && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="city"
                        className={`input ${validationErrors.city ? 'border-red-500' : ''}`}
                        placeholder="e.g. Lyon"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Code Postal</p>
                        {validationErrors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="postalCode"
                        className={`input ${validationErrors.postalCode ? 'border-red-500' : ''}`}
                        placeholder="e.g. 69001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléphone</p>
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className={`input ${validationErrors.phone ? 'border-red-500' : ''}`}
                      placeholder="e.g. +1 234 567 890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </li>

                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléchargez votre pièce d'identité (recto et verso) pour la première personne.</p>
                      {/* {validationErrors.uploadPhotosPerson1 && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.uploadPhotosPerson1}</p>
                      )} */}
                    </div>
                    <UploadPhotos
                      uploadPhotos={uploadPhotosPerson1}
                      setUploadPhotos={setUploadPhotosPerson1}
                    />
                  </li>

                  <br />
                  <li className="list__itemTwo">
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Prénom <small>(Deuxième Personne)</small></p>
                        {validationErrors.nameTwo && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.nameTwo}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="Nom"
                        className={`input ${validationErrors.nameTwo ? 'border-red-500' : ''}`}
                        placeholder="e.g. King"
                        value={nameTwo}
                        onChange={(e) => setNameTwo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Nom de famille <small>(Deuxième Personne)</small></p>
                        {validationErrors.familyNameTwo && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.familyNameTwo}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="Prenom"
                        className={`input ${validationErrors.familyNameTwo ? 'border-red-500' : ''}`}
                        placeholder="e.g. Stephen"
                        value={familyNameTwo}
                        onChange={(e) => setFamilyNameTwo(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Email (Personne 2)</p>
                      {validationErrors.emailTwo && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.emailTwo}</p>
                      )}
                    </div>
                    <input
                      type="email"
                      name="emailTwo"
                      className={`input ${validationErrors.emailTwo ? 'border-red-500' : ''}`}
                      placeholder="e.g. stephenking@lorem.com"
                      value={emailTwo}
                      onChange={(e) => setEmailTwo(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Adresse <small>(Deuxième Personne)</small></p>
                      {validationErrors.addressTwo && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.addressTwo}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      name="addressTwo"
                      className={`input ${validationErrors.addressTwo ? 'border-red-500' : ''}`}
                      placeholder="e.g. Lyon-55-street"
                      value={addressTwo}
                      onChange={(e) => setAddressTwo(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__itemTwo">
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Ville <small>(Deuxième Personne)</small></p>
                        {validationErrors.cityTwo && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.cityTwo}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="cityTwo"
                        className={`input ${validationErrors.cityTwo ? 'border-red-500' : ''}`}
                        placeholder="e.g. Lyon"
                        value={cityTwo}
                        onChange={(e) => setCityTwo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Code Postal <small>(Deuxième Personne)</small></p>
                        {validationErrors.postalCodeTwo && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.postalCodeTwo}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        name="postalCodeTwo"
                        className={`input ${validationErrors.postalCodeTwo ? 'border-red-500' : ''}`}
                        placeholder="e.g. 69001"
                        value={postalCodeTwo}
                        onChange={(e) => setPostalCodeTwo(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléphone <small>(Deuxième Personne)</small> </p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="tel"
                      name="phoneTwo"
                      className="input"
                      placeholder="e.g. +1 234 567 890"
                      value={phoneTwo}
                      onChange={(e) => setPhoneTwo(e.target.value)}
                      required
                    />
                  </li>

                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléchargez votre pièce d'identité (recto et verso) pour la deuxième personne.</p>
                      {/* {validationErrors.uploadPhotosPerson2 && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.uploadPhotosPerson2}</p>
                      )} */}
                    </div>
                    <UploadPhotos
                      uploadPhotos={uploadPhotosPerson2}
                      setUploadPhotos={setUploadPhotosPerson2}
                    />
                  </li>
                </ul>
              </div>
            )}

            {stepNum === 2 && (
              <div className="step active" id="step-2">


                <h3 className="main__title">Choisir votre Box</h3>
                <p className="description">
                  Choisissez Parmi Nos Boxes Exclusives
                </p>

                <div className="menu">

                  {error && <div>Error loading boxes: {error}</div>}
                  {!loading && boxes.length > 0 ? (
                    <section className="mains">
                      {/* Promo Button */}
                      <div className="promo-container">

                        <button className="love-promo-btn" onClick={() => setShowPopup(true)}>
                          <span className="heart-icon">❤️</span>
                          Code Promo
                          <span className="heart-icon">❤️</span>
                        </button>
                      </div>
                      <br />

                      {boxes.map((box, index) => (
                        <article className="menu-item" key={box._id}>
                          <h3 className="mains-name">{box.name}</h3>

                          <div className="checkbox-wrapper-12">
                            <div className="cbx">
                              <input
                                checked={!!checkedItems[index]} // Get the checked state for each item
                                onChange={(e) => {
                                  e.stopPropagation(); // Prevent onClick from firing
                                  handleBoxChange(box, index); // Pass the box object and index
                                }}
                                type="checkbox"
                                id={`cbx-12-${index}`} // Make the id unique for each checkbox
                              />
                              <label htmlFor={`cbx-12-${index}`}></label> {/* Match the label's 'for' attribute */}
                              <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                                <path d="M2 8.36364L6.23077 12L13 2"></path>
                              </svg>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                              <defs>
                                <filter id="goo-12">
                                  <feGaussianBlur
                                    in="SourceGraphic"
                                    stdDeviation="4"
                                    result="blur"
                                  ></feGaussianBlur>
                                  <feColorMatrix
                                    in="blur"
                                    mode="matrix"
                                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                    result="goo-12"
                                  ></feColorMatrix>
                                  <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
                                </filter>
                              </defs>
                            </svg>
                          </div>

                          <strong className="mains-price">{box.price} €</strong>
                          <p className="mains-description">
                            {Array.isArray(box.items) ? box.items.join(', ') : 'No items available'}
                          </p>
                        </article>
                      ))}

                      {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                          <div className="bg-gradient-to-br from-[#C84B31] to-[#6A1814] p-6 rounded-xl shadow-xl">
                            <h2 className="text-xl font-semibold mb-3 text-white tracking-wide">
                              Code Promo
                            </h2>
                            <input
                              type="text"
                              className="p-3 w-full mb-4 rounded-md bg-[#FAF3F0] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D26051] transition"
                              placeholder="Saisissez votre code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setShowPopup(false)}
                                className="px-5 py-2 text-white rounded-lg bg-transparent hover:bg-[#EFAEAE] hover:text-[#6A1814] transition duration-200"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={handleApplyPromo}
                                className="px-5 py-2 bg-[#EFAEAE] text-[#6A1814] font-semibold rounded-lg hover:bg-[#6A1814] hover:text-white transition duration-200"
                              >
                                Valider
                              </button>
                            </div>
                          </div>
                        </div>


                      )}
                    </section>
                  ) : !loading && (
                    <div className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer">
                      <span>No boxes available</span>
                    </div>
                  )}


                  {/* 
                  <aside className="aside">
                    <section className="extras">
                      <h2 className="extras-heading">Sides</h2>
                      <article className="menu-item" >
                        <div className="extras-name">servt</div>
                        <input
                          type="text"
                          inputmode="numeric"
                          pattern="[0-9]*"


                        />
                        <strong className="extras-price">$20</strong>
                      </article>
                    </section>
                    <section className="extras">
                      <h2 className="extras-heading">Drinks</h2>
                      <article className="menu-item" >
                        <div className="extras-name">test</div>
                        <input
                          type="text"
                          inputmode="numeric"
                          pattern="[0-9]*"


                        />
                        <strong className="extras-price">$20</strong>
                      </article>
                    </section>
                  </aside> */}


                  {/* <div className="total">
                    <span className="total-title">Total:</span>
                    <span className="total-price">$77</span>
                  </div> */}
                </div>

                {/* <div className="plan__card_container" id="plan-cards">
                  {error && <div>Error loading boxes: {error}</div>}
                  {!loading && boxes.length > 0 ? (
                    boxes.map(box => (
                  


                      <div
                        key={box._id}
                        className={`plan__card card  ${selectedBox && selectedBox.box && selectedBox.box.name === box.name ? 'selected' : ''}`}
                        onClick={() =>
                          handleBoxSelect({
                            box
                          })
                        }
                      >
                 
                        <div className="plan__price">
                          <p className="card__name">{box.name}</p>
                          <p className="card__price">
                            {box.price} €
                          </p>
            
                        </div>
                      </div>



                    ))
                  ) : !loading && (
                    <div className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer">
                      <span>No boxes available</span>
                    </div>
                  )}

                </div> */}


                {/* <div className="toggle__container">
                  <p className={`monthly__plan ${billingDuration === 'monthly' ? 'selected__plan' : ''}`} id="monthly">
                    Monthly
                  </p>
                  <div className="toggle" onClick={toggleBillingDuration}>
                    <div className={`toggle__circle ${billingDuration === 'yearly' ? 'active' : ''}`} id="toggle"></div>
                  </div>
                  <p className={`yearly__plan ${billingDuration === 'yearly' ? 'selected__plan' : ''}`} id="yearly">
                    Yearly
                  </p>
                </div> */}

              </div>
            )}


            {stepNum === 3 && (
              <div className="step active" id="step-3">
                <h3 className="main__title">Serviettes de bain</h3>
                <p className="description">
                  Souhaitez-vous des serviettes fraîches et douillettes pour votre séjour ? 🛁✨
                </p>
                <div className="menu">



                  <section className="mains">

                    <article className="menu-item" >
                      <h3 className="mains-name">Serviette de Bain</h3>

                      <div className="checkbox-wrapper-12">
                        <div className="cbx">
                          <input
                            checked={includeSheets} // Get the checked state for each item
                            onChange={() => setIncludeSheets(!includeSheets)}
                            type="checkbox"

                          />
                          <label htmlFor={`cbx-12-25`}></label> {/* Match the label's 'for' attribute */}
                          <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                            <path d="M2 8.36364L6.23077 12L13 2"></path>
                          </svg>
                        </div>

                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                          <defs>
                            <filter id="goo-12">
                              <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="4"
                                result="blur"
                              ></feGaussianBlur>
                              <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                result="goo-12"
                              ></feColorMatrix>
                              <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
                            </filter>
                          </defs>
                        </svg>
                      </div>

                      <strong className="mains-price">20 €</strong>
                      <p className="mains-description">
                        Supplément de 20€ pour des serviettes fraîches et douces.
                      </p>
                    </article>

                  </section>



                </div>







              </div>
            )}

            {stepNum === 4 && (
              <div className="step active" id="step-4">
                <h3 className="main__title">Vérification des Informations</h3>
                <p className="description">
                  Vérifiez les détails de votre réservation et procédez au paiement.
                </p>
                {/* <ul className="list">
                  <li className="list__itemFour">
                    <div className="summary__section">
                      <h4 className="summary__title">Récapitulatif de la réservation</h4>
                      <div className="summary__details">
                        <p className="summary__item">
                          <span>Option choisie:</span> {option}
                        </p>
                        <p className="summary__item">
                          <span>Date de début:</span> {formatDate(startDate)}
                        </p>
                        <p className="summary__item">
                          <span>Date de fin:</span> {formatDate(endDate)}
                        </p>
                        <p className="summary__item">
                          <span>Type de jour:</span> {dayType}
                        </p>

                        <p className="summary__item">
                          <span>Box:</span> {selectedBox.box.name}€
                        </p>
                        <p className="summary__item">
                          <span>Prix de la réservation:</span> {total}€
                        </p>
                      </div>
                    </div>
                    <UploadPhotos setUploadPhotos={setUploadPhotos} uploadPhotos={uploadPhotos} />
                  </li>
                </ul> */}

                <div className="card">

                  <div className="card-body">
                    <h2 className="text-[16px] font-semibold">Détails personnels </h2>
                    {/* <p class="mb-4 text-sm font-norma">

</p> */}
                    <form method="get" className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="label" htmlFor="new-password">
                          {/* <span class="my-1 block">Nom</span> */}
                          <h3 className='recap-filed' > <span>Prénom & Nom de famille : </span> {familyName} {name}</h3>
                        </label>
                        <label className="label" htmlFor="confirm-password">
                          {/* <span class="my-1 block">Prix </span> */}
                          <h3 className='recap-filed' > <span>Téléphone : </span>  {phone}</h3>
                        </label>

                        <label className="label" htmlFor="confirm-password">

                          <h3 className='recap-filed' > <span>Email : </span>  {email} </h3>
                        </label>

                      </div>

                      <h2 className="text-[16px] font-semibold">Détails de la deuxième personne </h2>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <label className="label" htmlFor="new-password">

                          <h3 className='recap-filed' > <span>Prénom & Nom de famille  : </span> {familyNameTwo} {nameTwo}</h3>
                        </label>
                        <label className="label" htmlFor="confirm-password">

                          <h3 className='recap-filed' > <span>Téléphone : </span>  {phoneTwo}</h3>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="label" htmlFor="new-password">

                          <h3 className='recap-filed' > <span>Email : </span>  {emailTwo}</h3>
                        </label>

                      </div>

                    </form>
                  </div>
                </div>

                <div >
                  <DisplayPhotos uploadPhotos={[...uploadPhotosPerson1, ...uploadPhotosPerson2]} />
                </div>


                <br />

                <div className="card">
                  {/* New Section */}
                  <section className="reservation-summary">
                    <h2 className="text-[16px] font-semibold " >Détails de tarification</h2>
                    {/* <h3 className='recap-filed'  >Dates sélectionnées</h3> */}

                    {addedDates.map(({ date, options, prices }, index) => (
                      <details key={index}>
                        <summary>
                          <div>

                            <h3 className='recap-filed' >
                              <strong> {format(new Date(date), "d MMMM yyyy", { locale: fr })}</strong>
                              <small>{options.join(", ")}</small>
                            </h3>
                            <span>
                              {options
                                .map((option) => (option === "Nuit" ? prices.night : prices.afternoon))
                                .reduce((acc, price) => acc + price, 0)} €
                            </span>
                          </div>
                        </summary>
                        <div>
                          <dl>
                            <div>
                              <dt>Options choisies</dt>
                              <dd>
                                {options.map((option, idx) => (
                                  <span key={idx}>
                                    {option} <span className="text-gray-400 text-xs">({option === "Nuit" ? `${prices.night}€` : `${prices.afternoon}€`})</span>
                                    {idx < options.length - 1 ? ", " : ""}


                                  </span>
                                ))}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </details>
                    ))}


                    <details>
                      <summary>
                        <div>
                          <h3 className="recap-filed">
                            <strong>Box</strong>
                            <small>
                              {Object.keys(checkedItems).length > 0
                                ? `${Object.keys(checkedItems).length} box${Object.keys(checkedItems).length > 1 ? 'es' : ''} sélectionnée(s)`
                                : 'Aucune box sélectionnée'}
                            </small>
                          </h3>
                          <span>
                            {Object.keys(checkedItems).length > 0
                              ? Object.keys(checkedItems).reduce((total, index) => total + boxes[index].price, 0)
                              : 0} €
                          </span>
                        </div>
                      </summary>
                      <div>
                        <dl>
                          {Object.keys(checkedItems).length > 0 ? (
                            Object.keys(checkedItems).map((index) => (
                              <div key={boxes[index]._id}>
                                <dt>{boxes[index].name} <span className="text-gray-400 text-xs">{boxes[index].price}€</span>  </dt>
                                <dd>
                                  <span>
                                    {Array.isArray(boxes[index].items) ? boxes[index].items.join(', ') : 'No items available'}
                                  </span>
                                </dd>
                              </div>
                            ))
                          ) : (
                            <div>
                              <dt>Aucune box sélectionnée</dt>
                              <dd>No box selected</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </details>




                    {/* Sheets Summary */}
                    <details>
                      <summary>
                        <div>
                          <h3 className="recap-filed">
                            <strong>Serviette de Bain</strong>
                            <small>{includeSheets ? 'Inclus' : 'Non inclus'}</small>
                          </h3>
                          <span>
                            {includeSheets ? '20' : '0'} €
                          </span>
                        </div>
                      </summary>
                      <div>
                        <dl>
                          <div>
                            <dt>{includeSheets ? 'Serviette de Bain Inclus' : 'Serviette de Bain Non Inclus'}</dt>
                            <dd>
                              <span>
                                {includeSheets
                                  ? 'Serviettes de bain propres et douces incluses pour 20€.'
                                  : 'Aucune serviette de bain supplémentaire sélectionnée.'}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </details>



                    <details >
                      <summary className='total-details'>
                        <div>

                          <h3 className='recap-filed' >
                            <strong> TOTAL</strong>
                            <small>Prix Total de la réservation</small>
                          </h3>
                          <span>
                            {total}
                            €
                          </span>
                        </div>
                      </summary>

                    </details>


                  </section>
                </div>

              </div>
            )}

            {/* PAYMENT STEP */}
            {/* Step 5: Payment */}
            {stepNum === 5 && (
              <>
                {(!bookingFeeClientSecret) && (
                  <div className="flex flex-col items-center justify-center mt-32">
                    <ClipLoader className="mb-4" />
                    <span>Loading...</span>
                  </div>
                )}
                {bookingFeeClientSecret && (
                  <Elements options={{ clientSecret: bookingFeeClientSecret, appearance, loader: 'auto' }} stripe={stripePromise}>
                    <PaymentComponent
                      isLoadingStripe={isLoadingStripe}
                      messageStripe={messageStripe}
                      paymentElementOptions={paymentElementOptions}
                      bookingFeeClientSecret={bookingFeeClientSecret}
                    // securityDepositClientSecret={securityDepositClientSecret}
                    />
                  </Elements>
                )}
              </>
            )}

            <br />

            <div className="button__container">
              {stepNum > 0 && stepNum < 5 && (
                <button className="button prev__button" onClick={handlePrev} id="prev-button">
                  <MdNavigateNext style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />
                  Retour
                </button>
              )}

              {stepNum < 5 && addedDates.length > 0 && (
                <button
                  className="button next__button"
                  onClick={handleNext}
                  id="next-button"
                  disabled={isBooking} // Disable while booking is in progress
                >
                  {isBooking ? (
                    <div className="spinner"></div>
                  ) : (
                    stepNum === 4 ? "Confirmer" : "Étape suivante"
                  )}
                  <MdNavigateNext style={{ marginLeft: '8px' }} />
                </button>
              )}

              {isBooking && stepNum === 4 && <BookingProgressModal isOpen={isBooking} />}
            </div>


          </div>
        </div>

      </main>

      {/* SUCC MESSAGE */}
      <SuccModal optionSucc={optionSucc} closeSuccModal={closeSuccModal} msg={msg} />
    </>
  );
}

export default Form;