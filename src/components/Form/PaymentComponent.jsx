import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FaLock } from "react-icons/fa"; // For lock icon

const PaymentComponent = ({ isLoadingStripe, messageStripe, paymentElementOptions, bookingFeeClientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false); // Checkbox state
  const [isNonRefundable, setIsNonRefundable] = useState(false); // Second checkbox

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing || !isAcknowledged || !isNonRefundable) return;

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(`Submission Error: ${submitError.message}`);
      }

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
      {/* Header with Branding */}
      <div className="text-center mb-6">
        <h3 className="main__title">Paiement</h3>
        <p className="description">
          Paiement sécurisé via Stripe pour finaliser votre réservation
        </p>
        <img
          src='/Powered by Stripe/Powered by Stripe - blurple.svg'
          alt="Stripe Logo"
          className="mx-auto mt-2 h-8"
        />
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <PaymentElement id="payment-element" options={paymentElementOptions} />
        </div>

        {/* Terms Checkboxes */}
        <div className="paiment__info flex items-start mb-4">
          <input
            type="checkbox"
            id="cbx"
            style={{ display: 'none' }}
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
          />
          <label htmlFor="cbx" className="check mr-2 cursor-pointer">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <p className="text-sm text-gray-700">
            Je reconnais qu'une caution de 200€ sera demandée lors de la remise des clés, via empreinte bancaire. Un lien vous sera envoyé. <strong>Le montant ne sera pas débité et sera libéré à la fin de la réservation</strong>, sous réserve du respect du règlement intérieur de notre établissement.
          </p>
        </div>

        <div className="paiment__info flex items-start mb-6">
          <input
            type="checkbox"
            id="cbx2"
            style={{ display: 'none' }}
            checked={isNonRefundable}
            onChange={(e) => setIsNonRefundable(e.target.checked)}
          />
          <label htmlFor="cbx2" className="check mr-2 cursor-pointer">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <p className="text-sm text-gray-700">
            Je reconnais que le paiement ne sera ni remboursé ni échangeable en cas d'annulation pour quelque raison que ce soit.
          </p>
        </div>

        {/* Security Messaging */}
        <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
          <FaLock className="mr-2 text-green-500" />
          <span>Paiement sécurisé avec chiffrement SSL 256 bits</span>
        </div>

        {/* Payment Method Logos */}
        <div className="flex justify-center gap-4 mb-6">
          <img src='/Powered by Stripe/Visa_Inc._logo.svg' alt="Visa" className="h-6 object-contain" />
          <img src='/Powered by Stripe/MasterCard_Logo.svg.webp' alt="MasterCard" className="h-6 object-contain" />
          <img src='/Powered by Stripe/amex.svg' alt="Amex" className="h-6 object-contain" />
        </div>

        {/* Submit Button */}
        <button
          className="button next__button w-full flex justify-center items-center"
          type="submit"
          disabled={isLoadingStripe || !stripe || !elements || isProcessing || !isAcknowledged || !isNonRefundable}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            <>
              <span>Payer maintenant</span>
            </>
          )}
        </button>

        {messageStripe && <div className="mt-4 text-center text-red-500">{messageStripe}</div>}
      </form>
    </div>
  );
};

export default PaymentComponent;