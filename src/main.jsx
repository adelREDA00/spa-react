import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { CustomProvider } from 'rsuite';
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// This is your test publishable API key from Stripe
const stripePromise = loadStripe("pk_test_51Pu69bRopxRnKDlSeamAioWdBM8bvfNS9TFPMvmG6ZDHLxd9xAIBkRaRB4PzWM5vCZra8UV2l1eSHqNyyU00s1Yt00d30Hbpt9");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomProvider>
        <App stripePromise={stripePromise} /> {/* Pass the stripePromise to the App component */}
      </CustomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
