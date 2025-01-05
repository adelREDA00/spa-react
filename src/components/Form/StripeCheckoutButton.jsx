import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StripeCheckoutButton = ({
  amount,
  startDate,
  endDate,
  option,
  dayType,
  total,
  placeId,
  bookingData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!bookingData || !amount || !startDate || !endDate) {
        setError("Missing or invalid booking data.");
        setLoading(false);
        return;
      }

      // Adjust dates to UTC
      const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

      // Step 1: Create booking in the backend
      const bookingResponse = await fetch(`http://localhost:5000/place/booking/${placeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          checkIn: adjustedStartDate,
          checkOut: adjustedEndDate,
          total: parseFloat(total),
        }),
      });

      const booking = await bookingResponse.json();
      if (!booking || !booking._id) {
        throw new Error("Booking creation failed.");
      }

      // Step 2: Create PaymentIntent on the backend
      const formattedEndDate = format(new Date(startDate), "d MMMM yyyy", { locale: fr });
      const combinedDescription = `Réservation pour ${option} en ${dayType}, Date: ${formattedEndDate}`;

      const stripeResponse = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount, // Amount in cents
          description: combinedDescription,
          bookingId: booking._id, // Attach booking ID
        }),
      });

      const { clientSecret } = await stripeResponse.json();
      if (!clientSecret) {
        throw new Error("Failed to create PaymentIntent.");
      }

      // Step 3: Confirm payment using Stripe Elements
      const card = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        },
      });

      if (error) {
        setError(error.message); // Display error message
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        // Optionally, update UI to show payment success
      } else {
        setError("Payment failed.");
      }
    } catch (error) {
      console.error("Error during payment process:", error.message);
      setError(error.message); // Set error message for UI feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <CardElement />
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Traitement en cours..." : `Payer maintenant (€${total})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripeCheckoutButton;
