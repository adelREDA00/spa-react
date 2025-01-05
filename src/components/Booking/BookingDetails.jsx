import React, { useState, useEffect } from "react";
import * as api from "../../api/requester";
import { useParams, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { format } from "date-fns";
import { fr } from 'date-fns/locale'; // Import the French locale
import ImageModal from "./ImageModal";


const URL_TO_UPLOADS =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/uploads/"
    : "https://spanode.onrender.com/uploads/";

function BookingDetails() {
  //image modal 
  const [selectedImage, setSelectedImage] = useState(null);

  //USERS INFO

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
  //payment
  const [paymentStatus, setPaymentStatus] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState({ amount: 0, status: '' });

  //GENERAL
  const [bookedPlace, setBookedPlace] = useState([]);
  const [ready, setReady] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [dayType, setDayType] = useState('');

  const determineDayType = (dateString) => {
    const date = new Date(dateString); // Convert the date string into a Date object
    const day = date.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    const newDayType = (day === 0 || day === 6) ? 'Weekend' : 'Jour de la semaine'; // Determine if it's a weekend or weekday
    setDayType(newDayType); // Update the day type state
  };



  async function getPlace() {
    try {
      const response = await api.getBookedPlace(id);
      setBookedPlace(response);
      setReady(true);

      console.log("bookingg res : ", response);

      // Update state with the fetched data
      if (response) {
        setName(response.name || '');
        setFamilyName(response.familyName || '');
        setEmail(response.email || '');
        setAddress(response.address || '');
        setPhone(response.phone || '');
        setNameTwo(response.nameTwo || '');
        setFamilyNameTwo(response.familyNameTwo || '');
        setEmailTwo(response.emailTwo || '');
        setAddressTwo(response.addressTwo || '');
        setPhoneTwo(response.phoneTwo || '');
        setPaymentStatus(response.paymentStatus);
        setSecurityDeposit(response.securityDeposit);
        // Check if checkIn date is available and call determineDayType
        if (response.checkIn) {
          determineDayType(response.checkIn);  // Call the function with the fetched checkIn date
        }
      }


    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPlace();
  }, [id]);




  const [showModal, setShowModal] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);


  // Remove booking function
  const removeBooking = async (id) => {
    try {
      // Replace this with your actual API delete call
      await api.deleteBooking(id);
      navigate("/account/bookings");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Handle Delete Button Click
  const handleDeleteClick = (id) => {
    setBookingIdToDelete(id); // Store booking ID to delete
    setShowModal(true); // Open modal
  };

    // Handle confirmation to delete the booking
    const handleConfirmDelete = async () => {
      if (bookingIdToDelete) {
        await removeBooking(bookingIdToDelete); // Delete the booking
      }
      setShowModal(false); // Close modal after delete
    };
  
    // Handle cancel delete
    const handleCancelDelete = () => {
      setShowModal(false); // Close modal
    };

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <ClipLoader className="mb-4" />
        <span>Loading...</span>
      </div>
    );
  }

  //image modal func
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };
  //copy link func
  const clientHoldLink = `${window.location.origin}/depot-securite/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(clientHoldLink);
    alert("Lien copié !");
  };

  return (

    <div className="content">

      <main className="container flex-grow p-4 sm:p-6">




        {/* <div className="mb-6 flex flex-col justify-between gap-y-1 sm:flex-row sm:gap-y-0">
          <h5>Profile</h5>

          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Users</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Profile</a>
            </li>
          </ol>
        </div> */}




        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {selectedImage && (
            <ImageModal
              imageUrl={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
          <section className="col-span-1 flex h-min w-full flex-col gap-6 lg:sticky lg:top-20">

            <div className="card">
              <div className="card-body flex flex-col items-center">
                <div className="relative my-2 h-50 w-50 rounded-full">
                  {/* <img
                    src="./images/avatar11.png"
                    alt="avatar-img"
                    id="user-image"
                    className="h-full w-full rounded-full"
                  /> */}

                  {bookedPlace.idPhotos?.[0] && (

                    <img
                      // className="aspect-square object-cover rounded-2xl relative bottom-2 "
                      src={
                        URL_TO_UPLOADS +
                        bookedPlace.idPhotos?.[0]
                      }
                      onClick={() => handleImageClick(URL_TO_UPLOADS +
                        bookedPlace.idPhotos?.[0])}
                      alt=""
                    />

                  )}

                  {/* <label
                    for="upload-avatar"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-50 p-2 dark:bg-slate-900"
                  >
                    <span className="text-slate-600 dark:text-slate-300">
                      <i className="w-full" data-feather="camera"></i>
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      className="hidden"
                      id="upload-avatar"
                    />
                  </label> */}
                </div>
                <h2 > {bookedPlace.name}    {bookedPlace.familyName}</h2>
                <p className="text-sm font-normal tracking-tight text-slate-400">{bookedPlace.phone}   </p>
                {/* <div className="badge badge-soft-success my-3 inline-block px-4">Payment</div> */}
              </div>
            </div>

            <div className="card">
              <div className="card-body flex flex-col items-center">
                <div className="relative my-2 h-50 w-50 rounded-full">
                  {/* <img
                    src="./images/avatar11.png"
                    alt="avatar-img"
                    id="user-image"
                    className="h-full w-full rounded-full"
                  /> */}

                  {bookedPlace.idPhotos?.[1] && (

                    <img
                      // className="aspect-square object-cover rounded-2xl relative bottom-2 "
                      src={
                        URL_TO_UPLOADS +
                        bookedPlace.idPhotos?.[1]
                      }
                      onClick={() => handleImageClick(URL_TO_UPLOADS +
                        bookedPlace.idPhotos?.[1])}
                      alt=""
                    />

                  )}

                  {/* <label
                    for="upload-avatar"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-50 p-2 dark:bg-slate-900"
                  >
                    <span className="text-slate-600 dark:text-slate-300">
                      <i className="w-full" data-feather="camera"></i>
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      className="hidden"
                      id="upload-avatar"
                    />
                  </label> */}
                </div>
                <h2 >  {bookedPlace.nameTwo}    {bookedPlace.familyNameTwo}</h2>
                <p className="text-sm font-normal tracking-tight text-slate-400">{bookedPlace.phoneTwo}   </p>
              </div>
            </div>



            <div className="card">
              <div className="card-body">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold ">État de la réservation</h3>
                  <button
                    data-toggle="modal"
                    data-target="#social-link"
                    className="cursor-pointer text-sm text-slate-600 duration-150 ease-in hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-500"
                  >
                    <i className="h-5" data-feather="edit"></i>
                  </button>
                </div>

                <div className="my-3 flex items-center gap-4">

                  <div>
                    <h5 className="text-sm font-medium ">Frais de réservation</h5>
                    <span className="cursor-not-allowed">
                      <p className="gadget succ-state ">{bookedPlace.paymentStatus}</p>
                    </span>
                  </div>
                </div>

                <div className="my-3 flex items-center gap-4">

                  <div>
                    <h5 className="text-sm font-medium">Dépôt de garanti</h5>
                    <span>
                      <p className={`gadget ${bookedPlace.securityDeposit.status === 'en attente' ? 'wait-state' : bookedPlace.securityDeposit.status === 'bloqué' ? 'succ-state' : ''}`}>
                        {bookedPlace.securityDeposit.status}
                      </p>
                    </span>
                  </div>
                </div>

                <div className="my-3 flex items-center gap-4">

                  <div>
                  <h5 className="text-sm font-medium ">Montant de la garantie</h5>
                    <span>
                      <p className={`gadget ${bookedPlace.securityDeposit.status === 'en attente' ? 'wait-state' : bookedPlace.securityDeposit.status === 'bloqué' ? 'succ-state' : ''}`}>
                        {bookedPlace.securityDeposit.amount} €
                      </p>
                    </span>
                  </div>


                </div>



                <div className="my-3 flex items-center gap-4">

                  <div>
                    <h5 className="text-sm font-medium ">Envoyer le lien</h5>

                    <span href="#" onClick={handleCopy}>
                      <p className="link-container ">{clientHoldLink}</p>
                    </span>

                  </div>

                </div>

                <div className="my-3 flex items-center gap-4">

                  <div>
                    <h5 className="text-sm font-medium ">ID de  réservation</h5>
                    <span>
                      <p className="text-sm font-normal text-primary-500">{id}</p>
                    </span>
                  </div>
                </div>


              </div>

            </div>
          </section>

          <section className="col-span-1 flex w-full flex-1 flex-col gap-6 lg:col-span-3 lg:w-auto">


            <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-s">Récapitulatif de la réservation</h2>

                <form method="get" className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="new-password">

                      <h3 className='recap-filed' > <span>Date de réservation : </span>{format(new Date(bookedPlace.checkIn), "d MMMM yyyy", { locale: fr })}
                      </h3>
                    </label>
                    <label className="label" for="confirm-password">

                      <h3 className='recap-filed' > <span>Fin de réservation : </span>
                        {format(new Date(bookedPlace.checkOut), "d MMMM yyyy", { locale: fr })}
                      </h3>
                    </label>
                  </div>


                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="new-password">

                      <h3 className='recap-filed' > <span>Période choisie : </span> {bookedPlace.option}</h3>
                    </label>
                    <label className="label" for="confirm-password">
                      <h3 className='recap-filed' > <span>Type de jour choisi : </span>{dayType}</h3>
                    </label>
                  </div>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold">Détails de tarification  </h2>
                {/* <p className="mb-4 text-sm font-norma">
                  
                </p> */}
                <form method="get" className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="new-password">
                      <h3 className='recap-filed' > <span>box choisi : </span>  {bookedPlace.boxes ? bookedPlace.boxes.name : 'Aucune box sélectionnée'}</h3>
                    </label>
                    <label className="label" for="confirm-password">
                      <h3 className='recap-filed' > <span>Prix de la box : </span>   {bookedPlace.boxes ? `${bookedPlace.boxes.price} €` : '0'} </h3>
                    </label>

                    <label className="label" for="confirm-password">
                      <h3 className='recap-filed' > <span>Période choisie : </span> {bookedPlace.option} / weekend</h3>
                    </label>

                    <label className="label" for="confirm-password">
                      <h3 className='recap-filed' > <span>Tarif de la période : </span>  180 €</h3>
                    </label>
                  </div>
                </form>
              </div>
              <br />
              <div className="card-body">
                <h2 className="text-[16px] font-semibold ">Prix Total de la réservation </h2>

                <form method="get" className="flex flex-col gap-5">


                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="new-password">

                      <h3> {bookedPlace.total} €</h3>
                    </label>

                  </div>

                  {/* <div className="flex items-center justify-end gap-4">
                        <button
                          type="cancel"
                          className="btn border border-slate-300 "
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">Update</button>
                      </div> */}
                </form>
              </div>

            </div>


            {/* FIRST USER INFO */}
            <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold ">Détails personnels <small>(Première Personne)</small></h2>
                <p className="mb-4 text-sm font-normal ">Gérer les informations</p>
                <form method="get" className="flex flex-col gap-5">

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="first-name">
                      <span className="my-1 block">Prénom</span>
                      <input type="text" className="input" value={name}
                        onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label className="label" for="last-name">
                      <span className="my-1 block">Nom de famille</span>
                      <input type="text" value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="phone">
                      <span className="my-1 block">Numéro</span>
                      <input type="text" className="input" value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                    </label>
                    <label className="label" for="email">
                      <span className="my-1 block">Adresse email</span>
                      <input type="email" className="input" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="street-address">
                      <span className="my-1 block">Adresse</span>
                      <input
                        type="text"
                        className="input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}

                      />
                    </label>
                    {/* <label className="label" for="city-state">
                      <span className="my-1 block">City/State</span>
                      <input type="text" className="input" value="California" id="city-state" />
                    </label> */}
                  </div>

                  {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="country">
                      <span className="my-1 block">Country</span>
                      <input type="text" className="input" value="United States" id="country" />
                    </label>
                    <label className="label" for="zip-code">
                      <span className="my-1 block">Zip Code</span>
                      <input type="text" className="input" value="90011" id="zip-code" />
                    </label>
                  </div> */}
                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="cancel"
                      className="btn border border-slate-300 "
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  </div>
                </form>
              </div>
            </div>
            {/* SECOND USER INFO */}
            <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold ">Détails personnels <small>(Deuxième Personne)</small></h2>
                <p className="mb-4 text-sm font-normal ">Gérer les informations</p>
                <form method="get" className="flex flex-col gap-5">

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="first-name">
                      <span className="my-1 block"> Prénom <small>(Deuxième Personne)</small></span>
                      <input type="text" className="input" value={nameTwo}
                        onChange={(e) => setNameTwo(e.target.value)} />
                    </label>
                    <label className="label" for="last-name">
                      <span className="my-1 block">Nom de famille <small>(Deuxième Personne)</small> </span>
                      <input type="text" value={familyNameTwo}
                        onChange={(e) => setFamilyNameTwo(e.target.value)} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="phone">
                      <span className="my-1 block">Numéro <small>(Deuxième Personne)</small></span>
                      <input type="text" className="input" value={phoneTwo}
                        onChange={(e) => setPhoneTwo(e.target.value)} />
                    </label>
                    <label className="label" for="email">
                      <span className="my-1 block">Adresse email <small>(Deuxième Personne)</small> </span>
                      <input type="email" className="input" value={emailTwo}
                        onChange={(e) => setEmailTwo(e.target.value)} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="street-address">
                      <span className="my-1 block">Adresse <small>(Deuxième Personne)</small> </span>
                      <input
                        type="text"
                        className="input"
                        value={addressTwo}
                        onChange={(e) => setAddressTwo(e.target.value)}
                        id="street-address"
                      />
                    </label>
                    {/* <label className="label" for="city-state">
                      <span className="my-1 block">City/State</span>
                      <input type="text" className="input" value="California" id="city-state" />
                    </label> */}
                  </div>

                  {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="country">
                      <span className="my-1 block">Country</span>
                      <input type="text" className="input" value="United States" id="country" />
                    </label>
                    <label className="label" for="zip-code">
                      <span className="my-1 block">Zip Code</span>
                      <input type="text" className="input" value="90011" id="zip-code" />
                    </label>
                  </div> */}

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="cancel"
                      className="btn border border-slate-300 "
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Mettre à jour</button>
                  </div>
                </form>
              </div>
            </div>

            {/* <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold text-slate-700 dark:text-slate-300">Change Password</h2>
                <p className="mb-4 text-sm font-normal text-slate-400">
                  Protect your account with a strong and secure password
                </p>
                <form method="get" className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="label" for="new-password">
                      <span className="my-1 block">New Password</span>
                      <input type="password" className="input" id="new-password" />
                    </label>
                    <label className="label" for="confirm-password">
                      <span className="my-1 block">Confirm Password</span>
                      <input type="password" className="input" id="confirm-password" />
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="cancel"
                      className="btn border border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Update</button>
                  </div>
                </form>
              </div>
            </div> */}



            {/* <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold text-slate-700 dark:text-slate-300">Notification</h2>
                <p className="mb-4 text-sm font-normal text-slate-400">Manage when you receive updates and alerts</p>
                <label for="show-desktop-notification" className="toggle my-2 flex items-center justify-between">
                  <div className="label">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Show desktop notification
                    </h3>
                    <p className="mb-4 text-sm font-normal text-slate-400">
                      Stay informed and in control with desktop notifications
                    </p>
                  </div>
                  <div className="relative">
                    <input className="toggle-input peer sr-only" id="show-desktop-notification" type="checkbox" />
                    <div className="toggle-body"></div>
                  </div>
                </label>
                <label for="send-email-notification" className="toggle my-2 flex items-center justify-between">
                  <div className="label">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Send email notification</h3>
                    <p className="mb-4 text-sm font-normal text-slate-400">
                      Stay up-to-date even when you're away from the platform
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      className="toggle-input peer sr-only"
                      id="send-email-notification"
                      type="checkbox"
                      checked=""
                    />
                    <div className="toggle-body"></div>
                  </div>
                </label>
                <label for="show-chat-notification" className="toggle my-2 flex items-center justify-between">
                  <div className="label">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Show chat notification</h3>
                    <p className="mb-4 text-sm font-normal text-slate-400">
                      Stay up-to-date even when you're away from the platform
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      className="toggle-input peer sr-only"
                      id="show-chat-notification"
                      type="checkbox"
                      checked=""
                    />
                    <div className="toggle-body"></div>
                  </div>
                </label>
              </div>
            </div> */}

            {/* <div className="card">
              <div className="card-body">
                <h2 className="text-[16px] font-semibold text-slate-700 dark:text-slate-300">Delete Account</h2>
                <p className="mb-4 text-sm font-normal text-slate-400">
                  Permanently remove your account and data from the platform
                </p>
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
                  <label className="label" for="password">
                    <span className="my-1 block">Confirm Your Password</span>
                    <input type="password" className="input" id="password" />
                  </label>
                  <div className="flex flex-wrap items-center justify-center md:items-end md:justify-end">
                    <div>
                      <button className="btn btn-danger px-6" type="submit">Delete My Account</button>
                    </div>
                  </div>
                </form>
              </div>
            </div> */}
          </section>

        </div>

        {/* <div className="modal" id="social-link">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div className="flex items-center justify-between">
                  <h6>Social Media</h6>
                  <button
                    type="button"
                    className="btn btn-plain-secondary dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:bg-slate-700"
                    data-dismiss="modal"
                  >
                    <i data-feather="x" width="1.5rem" height="1.5rem"></i>
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <form method="post" className="-mt-1.5 flex w-full flex-col space-y-3">
                  <div>
                    <label className="label" for="facebook"> Facebook </label>
                    <input type="text" className="input" value="" id="facebook" name="facebook" />
                  </div>

                  <div>
                    <label className="label" for="instagram"> Instragram </label>
                    <input
                      type="text"
                      className="input"
                      value="https://www.instagram.com/ahmedshakil"
                      name="instagram"
                      id="instagram"
                    />
                  </div>

                  <div>
                    <label className="label" for="twitter"> Twitter </label>
                    <input
                      type="text"
                      className="input"
                      value="https://twitter.com/ahmedshakil"
                      id="twitter"
                      name="twitter"
                    />
                  </div>

                  <div>
                    <label className="label" for="linkedin"> LinkedIn </label>
                    <input
                      type="text"
                      className="input"
                      value="https://linkedin.com/ahmedshakil"
                      id="linkedin"
                      name="linkedin"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="flex items-center justify-end gap-4">
                  <button type="cancel" className="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      </main>
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleDeleteClick(id)} // Open modal with booking ID
        className="primary max-w-[200px] md:max-w-md mb-4"
      >
        Supprimer la réservation
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Êtes-vous sûr ?</h3>
            <p className="text-gray-600 mb-6">
            Cette action est irréversible. Voulez-vous continuer ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelDelete} // Close modal on cancel
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
              >
              Annuler
              </button>
              <button
                onClick={handleConfirmDelete} // Confirm deletion
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


    </div>
  )
}

export default BookingDetails