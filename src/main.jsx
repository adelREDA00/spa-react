import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { CustomProvider } from 'rsuite';
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// This is your test publishable API key from Stripe
//LIVE MODE 
const stripePromise = loadStripe("pk_live_51Q1roLCzmHkB4qT7kOc0OviXrIuRYjBnhXf1kQrosS27XCOQnDkqkD8XRiqoRr0LZ3V8JfMoU5CbIg9bRQNJMPmF00Ne2IB13h");

//TEST MODE
// const stripePromise = loadStripe("pk_test_51Q1roLCzmHkB4qT7sKvfinQdaPMJhJjX1Z5St5SiNcBO3NxRGm2jdPxwQhY6i5YqTE595jBTRBX1t3uR6yYBAv5600mASOxPtu");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomProvider>
        <App stripePromise={stripePromise} /> {/* Pass the stripePromise to the App component */}
      </CustomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
