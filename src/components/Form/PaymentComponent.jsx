import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://spanode.onrender.com";

const PaymentComponent = ({ isLoadingStripe, messageStripe, paymentElementOption, bookingFeeClientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false); // Checkbox state
  const [isNonRefundable, setIsNonRefundable] = useState(false); // Second checkbox

  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing || !isAcknowledged || !isNonRefundable ) return;

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
          return_url: `${window.location.origin}/success`, // Redirect user after successful payment
        },
        redirect: 'if_required',
      });

      if (bookingFeeError) {
        throw new Error(`Booking Fee Payment Error: ${bookingFeeError.message}`);
      }

      console.log("Booking Fee Payment Successful");
      window.location.href = `${window.location.origin}/success`; // Redirect to success page after payment is successful

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

        <div className="paiment__info">
          <input
            type="checkbox"
            id="cbx"
            style={{ display: 'none' }}
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
          />
          <label htmlFor="cbx" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <p>
            je reconnais qu’une  caution de 200€ sera demandé lors de la remise des clés, via empreinte bancaire.Un lien vous sera envoyé .<strong> Le montant ne sera pas débité et sera libéré à la fin de la réservation</strong>, sous réserve du respect du règlement intérieur de notre établissement
          </p>
        </div>


        
        <div className="paiment__info">
          <input
            type="checkbox"
            id="cbx2"
            style={{ display: 'none' }}
            checked={isNonRefundable}
            onChange={(e) => setIsNonRefundable(e.target.checked)}
          />
          <label htmlFor="cbx2" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <p>
          je reconnais que le paiement ne sera ni remboursé et échangeable en cas d’annulation pour quelconques raisons
          </p>
        </div>



        <br />
        <button
          className="button next__button"
          type="submit"
          disabled={isLoadingStripe || !stripe || !elements || isProcessing || !isAcknowledged || !isNonRefundable }
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
