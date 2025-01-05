import React, { useState, useEffect } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router-dom";
import SecurityDepositPayment from "./SecurityDepositPayment";

const URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://spanode.onrender.com";

function SecurityPage({ stripePromise }) {
  const [securityDepositClientSecret, setSecurityDepositClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();


  useEffect(() => {
    let isMounted = true;
  
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(`${URL}/depot-securite`, { bookingId });
        if (isMounted) {
          setSecurityDepositClientSecret(response.data.securityDepositClientSecret);
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
  
    fetchClientSecret();
  
    return () => {
      isMounted = false; // Cleanup
    };
  }, [bookingId]);
  
  useEffect(() => {
    console.log("SecurityPage mounted");
    return () => console.log("SecurityPage unmounted");
  }, []);
  

  const appearance = { theme: "stripe" };
  const paymentElementOptions = { layout: "tabs" };

  return (
    <div className="max-w-global mx-auto supp">
      <>
        {(!securityDepositClientSecret) && (
          <div className="flex flex-col items-center justify-center mt-32">
            <ClipLoader className="mb-4" />
            <span>Loading...</span>
          </div>
        )}
        {securityDepositClientSecret && (
          <Elements options={{ clientSecret: securityDepositClientSecret, appearance, loader: 'auto' }} stripe={stripePromise}>
            <SecurityDepositPayment
              securityDepositClientSecret={securityDepositClientSecret}
              paymentElementOptions={paymentElementOptions}
              bookingId={bookingId}
            />
          </Elements>
        )}
      </>

    </div>
  );
}

export default SecurityPage;
