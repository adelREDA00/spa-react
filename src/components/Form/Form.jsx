import React, { useState, useEffect } from 'react';
import axios from "axios";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { fr } from 'date-fns/locale';
import { format } from "date-fns";
import UploadPhotos from "../AddPlaces/UploadPhotos";
import * as api from "../../api/requester";
import { MdNightlightRound } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import { useParams } from "react-router-dom";
import SuccModal from '../modal/SuccModal';
import { Elements } from "@stripe/react-stripe-js";
import PaymentComponent from './PaymentComponent';
import ClipLoader from "react-spinners/ClipLoader";

axios.defaults.baseURL = "https://localhost:5000";
axios.defaults.withCredentials = true;

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://spanode.onrender.com";

function Form({ stripePromise }) {
  const { placeId } = useParams();

  const [disabledDates, setDisabledDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [availableOptions, setAvailableOptions] = useState(['Nuit', 'Après-midi']);
  const [errorDates, setErrorDates] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDates = async () => {
      try {
        const { fullyBookedDates, bookedSlots } = await api.fetchBookedDates(placeId);
        if (isMounted) {
          setDisabledDates(fullyBookedDates.map(date => new Date(date)));
          setBookedSlots(bookedSlots);
          setErrorDates(null); // Clear any previous error
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching booked dates:', err);
          setErrorDates('Failed to load booking data. Please try again.');
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
  






  const [optionSucc, setOptionSucc] = useState(false);
  //SUCC MODAL MESSAGE
  const [msg, setMsg] = useState("");

  const [option, setOption] = useState('');
  const [price, setPrice] = useState('');

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



  const [stepNum, setStepNum] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dayType, setDayType] = useState('');
  const [prices, setPrices] = useState({ night: 0, afternoon: 0 });

  const [uploadPhotos, setUploadPhotos] = useState([]);

  const [planPrices, setPlanPrices] = useState({
    monthly: [90, 180],
    yearly: [220, 120],
  });
  const [addonPrices, setAddonPrices] = useState({
    monthly: [1, 2],
    yearly: [10, 20],
  });
  const [billingDuration, setBillingDuration] = useState('monthly');

  useEffect(() => {
    // Fetch initial plan and addon prices
    setPlanPrices({
      monthly: [90, 180],
      yearly: [220, 120],
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
  const [checkedItems, setCheckedItems] = useState({}); // Object to store checked state for each item

  const handleBoxChange = (selectedbox, index) => {
    setSelectedBox(prevSelectedBox => {
      // If the same box is selected, unselect it by setting selectedBox to null
      if (prevSelectedBox && prevSelectedBox.name === selectedbox.name) {
        return null;
      } else {
        // Otherwise, select the new box
        return selectedbox;
      }
    });

    setCheckedItems(prevState => {
      // If the box is already checked, uncheck all boxes (reset checkedItems)
      if (prevState[index]) {
        return {};
      } else {
        // Otherwise, check the current box and uncheck all others
        return { [index]: true };
      }
    });
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

  const handleNext = () => {
    if (stepNum === 2) {
      // Validate if a plan and a box are selected before proceeding to the last step
      if (!selectedPlan.name) {
        alert('Please select a plan.');
        return;
      }

      // if (!selectedBox.box) {
      //   alert('Please select a box.');
      //   return;
      // }

      calculateTotal(); // Calculate the total when moving to the last step
    }

    if (stepNum < 4) {
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
    setSelectedPlan(plan);
    setPrice(plan.price);
    setOption(plan.name);
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



  const calculateTotal = () => {
    // Initialize total with the price of the selected plan
    let total = parseInt(selectedPlan.price || 0);

    // Add the price of the selected box if it exists
    if (selectedBox) {
      total += parseInt(selectedBox.price || 0);
    }

    // Update the total state and return the total
    setTotal(total);
    return total;
  };

  // Example usage in the component
  useEffect(() => {
    calculateTotal(); // Recalculate total whenever selectedPlan or selectedBox changes
  }, [selectedPlan, selectedBox]);

  const handleSelect = (ranges) => {
    // 1. Set the selected start and end dates
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);

    // 2. Determine the day type (weekday/weekend)
    determineDayType(ranges.selection.startDate);

    // 3. Get the selected date in the YYYY-MM-DD format
    const selectedDate = ranges.selection.startDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

   

    // 4. Check available time slots for the selected date
    if (bookedSlots[selectedDate]) {
      // Extract time slots for the selected date
      const bookedTimeSlots = bookedSlots[selectedDate].map(slot => slot.timeSlot);

      // Filter options based on already booked time slots
      const optionsLeft = ['Nuit', 'Après-midi'].filter(option => !bookedTimeSlots.includes(option));
      setAvailableOptions(optionsLeft);
    } else {
      // If the date is not booked at all, both options are available
      setAvailableOptions(['Nuit', 'Après-midi']);
    }
  };




  const determineDayType = (date) => {
    const day = date.getDay();
    const newDayType = day === 0 || day === 6 || day === 5 ? 'Weekend' : 'Jour de la semaine';
    setDayType(newDayType);
    calculatePrices(newDayType);
  };

  const calculatePrices = (dayType) => {
    if (dayType === 'Weekend') {
      setPrices({ night: 220, afternoon: 120 });
    } else {
      setPrices({ night: 180, afternoon: 90 });
    }
  };

  //old booking func 
  const bookingPlace = async () => {

    // Adjust startDate to remove time offset
    const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);


    const data = {
      place: placeId,

      option,
      checkIn: adjustedStartDate,
      checkOut: adjustedEndDate,
      price: parseFloat(price),

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

      idPhotos: uploadPhotos,
      boxes: selectedBox ? selectedBox._id : null, // Handle null case
      total: parseFloat(total),
    };

    try {
      const response = await api.bookPlace(placeId, data);
      
      if (response && response._id) {
        console.log("Place booked successfully!");
        // Handle successful booking
        setMsg('Votre réservation est terminée. Vous serez redirigé vers la page de paiement')
        setOptionSucc(true);
      } else {
        console.log("An error occurred while booking rental option.");
        setMsg('Votre réservation est terminée. Vous serez redirigé vers la page de paiement')
        setOptionSucc(true);
      }
    } catch (err) {
      console.log("An error occurred:", err);
    }
  };

  //prepare the booknig data before sending it to the stripBtn
  const prepareBookingData = () => {
    // Adjust dates for timezone offset
    const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

    // Ensure all required fields are filled
    if (!name || !familyName || !email || !phone || !startDate || !endDate || !total) {
      setError("Please complete all required fields before proceeding.");
      return null;
    }

    // Consolidate booking data into one object
    const bookingData = {
      place: placeId,
      option,
      checkIn: adjustedStartDate,
      checkOut: adjustedEndDate,
      price: parseFloat(price),
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
      idPhotos:uploadPhotos,
      boxes: selectedBox ? selectedBox._id : null, // Handle null case
      total: parseFloat(total),
    };

    return bookingData;
  };


  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
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
    if (stepNum === 4) {
      // Fetch the client secret only when reaching the payment step
      const fetchClientSecret = async () => {
        try {
          const response = await axios.post(`${URL}/paymentIntentStripe`, {
            bookingFee: Math.round(total * 100), // Replace with your actual booking fee,
            // securityDeposit: Math.round(200 * 100),
            name: name, // Replace with the actual user's name from your state or props
            familyName: familyName, // Replace with the actual user's family name from your state or props
            email: email // Replace with the actual user's email from your state or props
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



  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorPayment(null);
    setIsLoading(true);

    try {
      // Validate booking data
      if (!bookingData || !total || !startDate || !endDate) {
        throw new Error("Missing or invalid booking data.");
      }

      // Adjust dates to UTC
      const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

      // Step 1: Create booking in the backend
      const bookingResponse = await axios.post(`${URL}/place/booking/${placeId}`, {
        ...bookingData,
        checkIn: adjustedStartDate,
        checkOut: adjustedEndDate,
        total: parseFloat(total),
      });

      const booking = bookingResponse.data;
      if (!booking || !booking._id) {
        throw new Error("Booking creation failed.");
      }

      // Step 2: Create PaymentIntent on the backend
      const formattedEndDate = format(new Date(startDate), "d MMMM yyyy", { locale: fr });
      const combinedDescription = `Réservation pour ${option} en ${dayType}, Date: ${formattedEndDate}`;

      const stripeResponse = await axios.post(`${URL}/create-payment-intent`, {
        amount: Math.round(total * 100), // Convert to cents
        description: combinedDescription,
        bookingId: booking._id,
      });

      const { clientSecret } = stripeResponse.data;
      if (!clientSecret) {
        throw new Error("Failed to create PaymentIntent.");
      }

      // Step 3: Confirm payment using Stripe Elements
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url:`${URL}/success` ,
        },
        redirect: "if_required",
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
        navigate("/success");
      } else {
        throw new Error("Payment failed.");
      }
    } catch (error) {
      console.error("Error during payment process:", error.message);
      setErrorPayment(error.message);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <main className="main">
        <div className="step__container">
          <div className="sidebar">
            {['CHOISIR VOTRE DATE', 'VOTRE INFO ', 'CHOISIR VOTRE BOX', 'PAYMENT'].map((step, index) => (
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
                  </li>

                  <p className="description">
                    Sélectionnez votre option
                  </p>
                  <li className="list__item">
                    <div className="plan__card_container" id="plan-cards">
                      {availableOptions.length > 0 ? (
                        availableOptions.map((plan, index) => (
                          <div
                            key={index}
                            className={`plan__card card borderCard ${selectedPlan.name === plan ? 'selected' : ''}`}
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
                                {plan === 'Nuit' ? <MdNightlightRound className="Icon-DayNight" /> : <IoIosSunny className="Icon-DayNight" />}
                                <span>{plan}</span>
                              </p>
                              <p className="card__price">
                                {plan === 'Nuit' ? `${prices.night}€` : `${prices.afternoon}€`}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="fully-booked-text">Cette date est complète. Aucun plan disponible.</p>
                      )}
                    </div>
                  </li>
                </ul>
              </form>


            )}

            {stepNum === 1 && (
              <div className="step active" id="step-2">
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




                  <li className="list__item">
                    <div className="input__labe">
                      <p className="label"> Téléchargez votre pièce d'identité pour les deux personnes. </p>
                      <p className="warning"></p>
                    </div>
                    <UploadPhotos
                      uploadPhotos={uploadPhotos}
                      setUploadPhotos={setUploadPhotos}
                    />
                  </li>

                </ul>


              </div>
            )}

            {stepNum === 2 && (
              <div className="step active" id="step-3">


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


                  {/* <aside className="aside">
                    <section className="extras">
                      <h2 className="extras-heading">Sides</h2>
                      {sides.map((item, index) => (
                        <article className="menu-item" key={index}>
                          <div className="extras-name">{item.name}</div>
                          <input
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            
                            name={name.replace(" ", "-").toLowerCase()}
                          />
                          <strong className="extras-price">${item.price}</strong>
                        </article>
                      ))}
                    </section>
                    <section className="extras">
                      <h2 className="extras-heading">Drinks</h2>
                      {drinks.map((item, index) => (
                        <article className="menu-item" key={index}>
                          <div className="extras-name">{item.name}</div>
                          <input
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                          
                            name={name.replace(" ", "-").toLowerCase()}
                          />
                          <strong className="extras-price">${item.price}</strong>
                        </article>
                      ))}
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
                <br />
                <div className="card">
                  <div className="card-body">
                    <UploadPhotos setUploadPhotos={setUploadPhotos} uploadPhotos={uploadPhotos} />
                  </div>
                </div>


                <br />

                <div className="card">
                  <div className="card-body">
                    <h2 className="text-[16px] font-semibold">Récapitulatif de la réservation</h2>

                    <form method="get" className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="label" htmlFor="new-password">

                          <h3 className='recap-filed' > <span>Date de réservation : </span> {format(new Date(startDate), "d MMMM yyyy", { locale: fr })}</h3>
                        </label>
                        <label className="label" htmlFor="confirm-password">

                          <h3 className='recap-filed' > <span>Fin de réservation : </span> {format(new Date(endDate), "d MMMM yyyy", { locale: fr })}</h3>
                        </label>
                      </div>


                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="label" htmlFor="new-password">

                          <h3 className='recap-filed' > <span>Période choisie : </span> {option}</h3>
                        </label>
                        <label className="label" htmlFor="confirm-password">
                          <h3 className='recap-filed' > <span>Type de jour choisi : </span>{dayType}</h3>
                        </label>
                      </div>
                    </form>
                  </div>
                </div>




                <br />
                <div className="card">
                  <div className="card-body">
                    <h2 className="text-[16px] font-semibold ">Détails de tarification  </h2>
                    {/* <p class="mb-4 text-sm font-norma">
                  
                </p> */}
                    <form method="get" className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <label className="label" >
                          <h3 className='recap-filed' ><span>Box choisi : </span>  {selectedBox ? selectedBox.name : 'Aucune box sélectionnée'}</h3>
                        </label>



                        <label className="label" htmlFor="confirm-password">
                          <h3 className='recap-filed' >     <span>Prix de la box : </span>  {selectedBox ? `${selectedBox.price} €` : 'Aucun prix disponible'}</h3>
                        </label>

                        <label className="label" htmlFor="confirm-password">
                          <h3 className='recap-filed' > <span>Période choisie : </span> {option} / {dayType}</h3>
                        </label>

                        <label className="label" htmlFor="confirm-password">
                          <h3 className='recap-filed' > <span>Tarif de la période : </span>  {selectedPlan.price} €</h3>
                        </label>
                      </div>
                    </form>
                  </div>
                  <br />
                  <div className="card-body">
                    <h2 className="text-[16px] font-semibold ">Prix Total de la réservation </h2>

                    <form method="get" className="flex flex-col gap-5">


                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="label" htmlFor="new-password">

                          <h3> {total} €</h3>
                        </label>

                      </div>

                      {/* <div class="flex items-center justify-end gap-4">
                        <button
                          type="cancel"
                          class="btn border border-slate-300 "
                        >
                          Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">Update</button>
                      </div> */}
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* PAYMENT STEP */}
            {/* Step 5: Payment */}
            {stepNum === 4 && (
              <>
                {(!bookingFeeClientSecret) && (
                  <div className="flex flex-col items-center justify-center mt-32">
                    <ClipLoader className="mb-4" />
                    <span>Loading...</span>
                  </div>
                )}
                {bookingFeeClientSecret  && (
                  <Elements options={{ clientSecret: bookingFeeClientSecret , appearance, loader: 'auto' }} stripe={stripePromise}>
                    <PaymentComponent
                      placeId={placeId}
                      stepNum={stepNum}
                      isLoadingStripe={isLoadingStripe}
                      messageStripe={messageStripe}
                      paymentElementOptions={paymentElementOptions}
                      bookingFeeClientSecret={bookingFeeClientSecret}
                      // securityDepositClientSecret={securityDepositClientSecret}
                      prepareBookingData={prepareBookingData()}
                      uploadPhotos={uploadPhotos}
                      setUploadPhotos={setUploadPhotos}
                    />
                  </Elements>
                )}
              </>
            )}

            <br />

            <div className="button__container">
              {stepNum > 0 && (
                <button className="button prev__button " onClick={handlePrev} id="prev-button">
                  <MdNavigateNext style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />
                  Retour
                </button>
              )}
              {stepNum < 4 && (
                <button className="button next__button" onClick={stepNum === 4 ? null : handleNext} id="next-button">

                  Étape suivante
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