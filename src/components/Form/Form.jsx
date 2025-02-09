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
  const [phone, setPhone] = useState('');
  const [nameTwo, setNameTwo] = useState('');
  const [familyNameTwo, setFamilyNameTwo] = useState('');
  const [emailTwo, setEmailTwo] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [phoneTwo, setPhoneTwo] = useState('');
  const [total, setTotal] = useState('');
  const [uploadPhotos, setUploadPhotos] = useState([]);

  const [uploadPhotosPerson1, setUploadPhotosPerson1] = useState([]); // For first person
  const [uploadPhotosPerson2, setUploadPhotosPerson2] = useState([]); // For second person


  const [price, setPrice] = useState('');
  const [stepNum, setStepNum] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);




  const [planPrices, setPlanPrices] = useState({
    monthly: [95, 190],//95
    yearly: [230, 125],
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
      yearly: [230, 125],
    });
    setAddonPrices({
      monthly: [1, 2],
      yearly: [10, 20],
    });
  }, []);

  //SHEETS 
  const [includeSheets, setIncludeSheets] = useState(false);


  //BOXES LIST 
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]); // Now an array of selected box IDs

  const handleBoxChange = (selectedBox, index) => {
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

  const handleNext = async () => {
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




  const handlePrev = () => {
    if (stepNum > 0) {
      setStepNum(prevStep => prevStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    // Perform booking confirmation logic here
    setShowModal(false); // Close modal after confirmation
  };

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




  const handleAddonToggle = (addon) => {
    setSelectedAddons((prevAddons) => {
      const exists = prevAddons.find((a) => a.name === addon.name);
      if (exists) {
        return prevAddons.filter((a) => a.name !== addon.name);
      } else {
        return [...prevAddons, addon];
      }
    });
  };

  //SUCC MSG MODAL

  const closeSuccModal = () => {
    setOptionSucc(false);
  };

  const toggleBillingDuration = () => {
    const newDuration = billingDuration === 'monthly' ? 'yearly' : 'monthly';
    setBillingDuration(newDuration);
  };


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
  }, [selectedBox, addedDates, includeSheets]);

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



  // //GET THE DATE TYPE WEEKEND OR WEE-KDAY
  // const determineDayType = (date) => {
  //   const day = date.getDay();
  //   const newDayType = day === 0 || day === 6 || day === 5 ? 'Weekend' : 'Jour de la semaine';
  //   setDayType(newDayType);
  //   calculatePrices(newDayType);
  // };
  // //CLALC THE DAY PRICE
  // const calculatePrices = (dayType) => {
  //   if (dayType === 'Weekend') {
  //     setPrices({ night: 230, afternoon: 125 });
  //   } else {
  //     // setPrices({ night: 190, afternoon: 95 });
  //     setPrices({ night: 190, afternoon: 95 });
  //   }
  // };


  const specialDates = {
    "02-14": { dayType: "Valentine", prices: { night: 250, afternoon: 150 } },
    // Add more special dates as needed
  };

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

  const calculatePrices = (dayType) => {
    switch (dayType) {
      case "Weekend":
        setPrices({ night: 230, afternoon: 125 });
        break;
      case "Jour de la semaine":
        setPrices({ night: 190, afternoon: 95 });
        break;
      case "Valentine":
        setPrices({ night: 250, afternoon: 150 }); // Special prices for Valentine's Day
        break;
      default:
        setPrices({ night: 190, afternoon: 95 }); // Default to weekday prices
    }
  };



  // //prepare the booknig data before sending it to the strip-comp
  // const prepareBookingData = async () => {
  //   // Adjust dates for timezone offset
  //   const adjustedDates = addedDates.map(({ date, options, prices }) => ({
  //     date: new Date(date.getTime() - date.getTimezoneOffset() * 60000), // Adjust for timezone
  //     options, // Include selected options (e.g., "Nuit", "Après-midi")
  //     prices, // Include prices for the options
  //   }));

  //   // Ensure all required fields are filled
  //   if (!name || !familyName || !email || !phone || !addedDates || !total) {
  //     setError("Please complete all required fields before proceeding.");
  //     return null;
  //   }

  //   // Step 1: Prepare FormData for the images upload
  //   const formData = new FormData();
  //   uploadPhotosPerson1.forEach((file) => formData.append("photos", file));
  //   uploadPhotosPerson2.forEach((file) => formData.append("photos", file));

  //   // Step 2: Upload images to the server
  //   let uploadedImages;
  //   try {
  //     const response = await api.uploadPhotoFromDevice(formData); // Assuming this API handles the upload
  //     if (!response || !Array.isArray(response)) {
  //       throw new Error("Failed to upload files or response is invalid");
  //     }
  //     uploadedImages = response; // Assuming this returns the uploaded image URLs
  //   } catch (error) {
  //     console.error("Image Upload Error:", error.message);
  //     setError("Failed to upload images. Please try again.");
  //     return null;
  //   }

  //   // Step 3: Add metadata to each image URL (from the uploaded images)
  //   const idPhotosPerson1 = uploadedImages
  //     .slice(0, uploadPhotosPerson1.length)
  //     .map((url) => ({ url, person: 1 })); // Add person: 1 metadata
  //   const idPhotosPerson2 = uploadedImages
  //     .slice(uploadPhotosPerson1.length)
  //     .map((url) => ({ url, person: 2 })); // Add person: 2 metadata

  //   // Combine images from both persons into a single array
  //   const idPhotos = [...idPhotosPerson1, ...idPhotosPerson2];

  //   // Collect the selected box IDs based on the checkedItems state
  //   const selectedBoxIds = Object.keys(checkedItems)
  //     .map(index => {
  //       const box = boxes[index];
  //       return box ? box._id : null; // Ensure that the box exists
  //     })
  //     .filter(id => id !== null); // Filter out null values in case of invalid boxes

  //   // Step 4: Consolidate all booking data into one object
  //   const bookingData = {
  //     place: placeId,
  //     dates: adjustedDates, // Include the adjusted dates with options and prices
  //     price: parseFloat(total), // Total price
  //     name,
  //     familyName,
  //     email,
  //     address,
  //     phone,
  //     nameTwo,
  //     familyNameTwo,
  //     emailTwo,
  //     addressTwo,
  //     phoneTwo,
  //     idPhotos, // Combined images with metadata
  //     boxes: selectedBoxIds,
  //     includeSheets, // Include the sheets option
  //     total: parseFloat(total),
  //     paymentStatus: "pending", // Set payment status to pending initially
  //   };

  //   // Step 5: Send the booking data to the backend to create the booking
  //   try {
  //     const bookingResponse = await fetch(`${URL}/place/booking/${placeId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(bookingData),
  //     });

  //     if (!bookingResponse.ok) {
  //       throw new Error("Failed to create booking on the server");
  //     }

  //     const booking = await bookingResponse.json();
  //     if (!booking || !booking._id) {
  //       throw new Error("Invalid booking response from the server");
  //     }

  //     console.log("Booking created successfully:", booking);

  //     // You can now handle the next steps (like redirecting, showing success, etc.)
  //     return booking; // You can use this object later if needed

  //   } catch (error) {
  //     console.error("Booking Creation Error:", error.message);
  //     setError("Failed to create the booking. Please try again.");
  //     return null;
  //   }
  // };



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
      maxSizeMB: 0.3, // Target ~300KB
      maxWidthOrHeight: 1024, // Resize to 1024px max
      initialQuality: 0.7, // 70% quality
      useWebWorker: true, // Faster compression
    };

    // Function to compress images while keeping original format
    const compressImages = async (files) => {
      return Promise.all(
        files.map(async (file) => {
          if (file.size < 200 * 1024) {
            return file; // Skip compression for small files
          }
          return await imageCompression(file, { ...compressionOptions, fileType: file.type });
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
      phone,
      nameTwo,
      familyNameTwo,
      emailTwo,
      addressTwo,
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





  // const handleAddDate = () => {
  //   // Ensure a date and at least one option are selected
  //   if (!startDate || option.length === 0) {
  //     alert("Veuillez sélectionner une date et au moins une option avant d'ajouter.");
  //     return;
  //   }

  //   // Determine the day type (weekend or weekday)
  //   const day = startDate.getDay();
  //   const dayType = day === 0 || day === 5 || day === 6 ? 'Weekend' : 'Jour de la semaine';

  //   // Calculate prices based on the day type
  //   const prices = dayType === 'Weekend' ? { night: 230, afternoon: 125 } : { night: 190, afternoon: 95 }; //95

  //   // Check if the selected date already exists in addedDates
  //   const existingDateIndex = addedDates.findIndex(
  //     (addedDate) => addedDate.date.toDateString() === startDate.toDateString()
  //   );

  //   if (existingDateIndex !== -1) {
  //     // If the date already exists, merge the options
  //     const updatedAddedDates = [...addedDates];
  //     const existingOptions = updatedAddedDates[existingDateIndex].options;

  //     // Add the new options to the existing ones (avoid duplicates)
  //     option.forEach((newOption) => {
  //       if (!existingOptions.includes(newOption)) {
  //         existingOptions.push(newOption);
  //       }
  //     });

  //     // Update the state with the merged options
  //     setAddedDates(updatedAddedDates);
  //   } else {
  //     // If the date does not exist, add a new entry with prices
  //     setAddedDates([
  //       ...addedDates,
  //       { date: startDate, options: option, prices },
  //     ]);
  //   }

  //   // Reset to allow selecting a new date
  //   setIsDateSelected(false);
  //   setStartDate(new Date());
  //   setOption([]);
  // };


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
        ? { night: 230, afternoon: 125 }
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

  console.log("addedDates", addedDates);
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
            bookingId: bookingId
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
                  rouge = complet , jaune = partiellement réservé.
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
                    Sélectionnez votre option
                  </p>

                  {isDateSelected && (
                    <li className="list__item">
                      <div className="plan__card_container" id="plan-cards">
                        {availableOptions.length > 0 ? (
                          availableOptions.map((plan, index) => (
                            <div
                              key={index}
                              className={`plan__card card borderCard ${option.includes(plan) ? 'selected' : ''
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
                                  <span className="price-amount">
                                    {plan === 'Nuit' ? `${prices.night}€` : `${prices.afternoon}€`}
                                  </span>
                                </p>
                              </div>
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
                      Confirmer la Date
                    </button>
                  )}

                  {/* Call-to-Action Button (When Dates Are Added) */}
                  {addedDates.length > 0 && !isDateSelected && (
                    <div onClick={() => setIsDateSelected(true)} className="add-plus-button">
                      Ajouter  <IoAdd size={20} />
                    </div>
                  )}
                  <br />

                  {/* Render Added Dates Dynamically */}
                  {addedDates
                    .slice() // Create a shallow copy
                    .reverse() // Reverse the copy
                    .map(({ date, options, prices }, index) => (
                      <li className="list__item added__Dates" key={index}>
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
                        <div className="plan__card_container" id="plan-cards">
                          {options.map((plan, idx) => (
                            <div
                              key={idx}
                              className={`plan__card card borderCard selected`}
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
                                  <span className="price-amount">
                                    {plan === 'Nuit' ? `${prices.night}€` : `${prices.afternoon}€`}
                                  </span>
                                </p>
                              </div>


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
                        <p className="warning"></p>
                      </div>
                      <input
                        type="text"
                        name="Nom"
                        className="input"
                        placeholder="e.g. King"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label"> Nom de famille</p>
                        <p className="warning"></p>
                      </div>
                      <input
                        type="text"
                        name="Prenom"
                        className="input"
                        placeholder="e.g. Stephen"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Email </p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="input"
                      placeholder="e.g. stephenking@lorem.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Address</p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="text"
                      name="address"
                      className="input"
                      placeholder="e.g. Lyon-55-street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléphone</p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className="input"
                      placeholder="e.g. +1 234 567 890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </li>

                  {/* Upload photos for the first person */}
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléchargez votre pièce d'identité (recto et verso) pour la première personne.</p>
                      <p className="warning"></p>
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
                        <p className="warning"></p>
                      </div>
                      <input
                        type="text"
                        name="Nom"
                        className="input"
                        placeholder="e.g. King"
                        value={nameTwo}
                        onChange={(e) => setNameTwo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input__container">
                      <div className="input__labe">
                        <p className="label">Nom de famille <small>(Deuxième Personne)</small></p>
                        <p className="warning"></p>
                      </div>
                      <input
                        type="text"
                        name="Prenom"
                        className="input"
                        placeholder="e.g. Stephen"
                        value={familyNameTwo}
                        onChange={(e) => setFamilyNameTwo(e.target.value)}
                        required
                      />
                    </div>
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label"> Email <small>(Deuxième Personne)</small></p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="email"
                      name="emailTwo"
                      className="input"
                      placeholder="e.g. stephenking@lorem.com"
                      value={emailTwo}
                      onChange={(e) => setEmailTwo(e.target.value)}
                      required
                    />
                  </li>
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Adresse <small><small>(Deuxième Personne)</small></small></p>
                      <p className="warning"></p>
                    </div>
                    <input
                      type="text"
                      name="addressTwo"
                      className="input"
                      placeholder="e.g. Lyon-55-street"
                      value={addressTwo}
                      onChange={(e) => setAddressTwo(e.target.value)}
                      required
                    />
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

                  {/* Upload photos for the second person */}
                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label">Téléchargez votre pièce d'identité (recto et verso) pour la deuxième personne.</p>
                      <p className="warning"></p>
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
                                .reduce((acc, price) => acc + price, 0)}
                              €
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
                                    {option} ({option === "Nuit" ? `${prices.night}€` : `${prices.afternoon}€`})
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
                                <dt>{boxes[index].name}</dt>
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
                            {includeSheets ? '20' : '0'}€
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