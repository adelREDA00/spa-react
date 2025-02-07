import React, { useState , useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://spanode.onrender.com";

const SecurityDepositPayment = ({ securityDepositClientSecret, paymentElementOptions, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing || !isAcknowledged) return;
  
    setIsProcessing(true);
  
    try {
      console.log("Submitting payment...");
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(`Submission Error: ${submitError.message}`);
      }
  
      console.log("Confirming payment...");
      const { error: securityDepositError } = await stripe.confirmPayment({
        elements,
        clientSecret: securityDepositClientSecret,
        confirmParams: { return_url: `${window.location.origin}/success` },
        redirect: "if_required",
      });
  
      if (securityDepositError) {
        throw new Error(`Security Deposit Payment Error: ${securityDepositError.message}`);
      }
  
      console.log("Security Deposit Hold Successful");
  
      const bookingResponse = await fetch(`${URL}/updateBookingDeposit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityDepositStatus: "bloqué", bookingId }),
      });
  
      if (!bookingResponse.ok) {
        throw new Error(`Failed to update booking: ${bookingResponse.statusText}`);
      }
      window.location.href = `${window.location.origin}/success`;
    } catch (err) {
      console.error("Payment Process Error:", err.message);
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    console.log("SecurityDepositPayment mounted");
    return () => console.log("SecurityDepositPayment unmounted");
  }, []);
  

  return (
    <div className="payment-container">
      <br />
      <h3 className="main__title" >Déposer une caution</h3>
      <p className="text-gray-500 text-base" >Une somme de <strong>200 €</strong> sera bloquée sur votre carte en cas de dommages. Ce montant ne sera pas débité et sera libéré à la fin de la réservation.</p>
      <form onSubmit={handlePaymentSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <br />
        <div className="paiment__info">
          <input
            type="checkbox"
            id="cbx"
            style={{ display: "none" }}
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
          />
          <label htmlFor="cbx" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <p  className="text-base" >Je reconnais qu'une somme de <strong>200 €</strong> sera bloquée sur ma carte en cas de dommages. Ce montant ne sera pas débité et sera libéré à la fin de la réservation.</p>
        </div>
        <br />
        <button
          className="button next__button"
          type="submit"
          disabled={isProcessing || !stripe || !elements || !isAcknowledged}
        >
          {isProcessing ? <div className="spinner"></div> : "Confirmer la réservation"}
        </button>
      </form>
    </div>
  );
};

export default SecurityDepositPayment;
