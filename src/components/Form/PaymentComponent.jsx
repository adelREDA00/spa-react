import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import * as api from "../../api/requester";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://spanode.onrender.com";

const PaymentComponent = ({ isLoadingStripe, messageStripe, paymentElementOption, bookingFeeClientSecret, prepareBookingData, placeId, uploadPhotos, setUploadPhotos }) => {


  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false); // Checkbox state

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing || !isAcknowledged) return;

    setIsProcessing(true);

    try {
      // Step 1: Submit the PaymentElement first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(`Submission Error: ${submitError.message}`);
      }

      // Step 2: Confirm the booking fee PaymentIntent
      const { error: bookingFeeError } = await stripe.confirmPayment({
        elements,
        clientSecret: bookingFeeClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (bookingFeeError) {
        throw new Error(`Booking Fee Payment Error: ${bookingFeeError.message}`);
      }

      console.log("Booking Fee Payment Successful");

      // Step 3: Confirm the security deposit PaymentIntent
      // if (securityDepositClientSecret) {
      //   await elements.submit();

      //   const { error: securityDepositError } = await stripe.confirmPayment({
      //     elements,
      //     clientSecret: securityDepositClientSecret,
      //     confirmParams: {
      //       return_url: `${window.location.origin}/success`,
      //     },
      //     redirect: 'if_required',
      //   });

      //   if (securityDepositError) {
      //     throw new Error(`Security Deposit Error: ${securityDepositError.message}`);
      //   }

      //   console.log("Security Deposit Hold Successful");
      // }

      // Upload photos
      const data = new FormData();
      uploadPhotos.forEach((file) => data.append("photos", file));

      const response = await api.uploadPhotoFromDevice(data);
      if (!response || !Array.isArray(response)) {
        throw new Error("Failed to upload files or response is invalid");
      }

      // Step 1: Update uploadPhotos state with the newly uploaded files (response)

      setUploadPhotos((prev) => [...prev, ...response]);



      // Step 2: Add idPhotos to prepareBookingData
      const updatedBookingData = {
        ...prepareBookingData,  // Spread the original data
        idPhotos: response,     // Add the uploaded photos to idPhotos
      };

      console.log("Files uploaded successfully");

      // Step 3: Create and confirm booking on the server
      const bookingResponse = await fetch(`${URL}/place/booking/${placeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBookingData), // Send updated booking data
      });

      if (!bookingResponse.ok) {
        throw new Error(`Failed to create booking on the server: ${bookingResponse.statusText}`);
      }

      const booking = await bookingResponse.json();

      if (!booking || !booking._id) {
        throw new Error("Invalid booking response from the server");
      }

      console.log("Booking created successfully:", booking);
      window.location.href = `${window.location.origin}/success`;

    } catch (err) {
      console.error("Payment Process Error:", err.message);
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="step active" id="step-5">
      <h3 className="main__title">Paiement</h3>
      <p className="description">
        Paiement sécurisé pour finaliser votre réservation.
      </p>
      <form onSubmit={handlePaymentSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOption} />
        <br />

        <div className="paiment__info" >
          <input type="checkbox" id="cbx" style={{ display: 'none' }} checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)} />
          <label htmlFor="cbx" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>

          <p>   Je reconnais qu'une somme de <strong>200 €</strong> sera bloquée sur ma carte <strong>24 heures</strong>  avant la date de réservation, en cas de dommages. 
          Ce montant ne sera pas débité et sera libéré à la fin de la réservation. </p>
        </div>

        <br />
        <button
          className="button next__button"
          type="submit"
          disabled={isLoadingStripe || !stripe || !elements || isProcessing || !isAcknowledged}
        >
          <span>
            {isProcessing ? <div className="spinner"></div> : "Payer maintenant"}
          </span>
        </button>
      </form>
      {messageStripe && <div>{messageStripe}</div>}
    </div>
  );
};

export default PaymentComponent;
