import React from "react";
import { Route, Routes } from "react-router-dom";
import Account from "./components/Account/Account";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserPlaces from "./components/Places/UserPlaces";
import AddPlaces from "./components/AddPlaces/AddPlaces";
import UserContextProvider from "./context/UserContext";
import Home from "./components/Home/Home";
import Form from "./components/Form/Form";
import SecurityPage from "./components/Form/SecurityPage";
import PlacePage from "./components/Places/PlacePage";
import BookingPlces from "./components/Booking/BookingPlces";
import InfoPlace from "./components/Booking/InfoPlace";
import Support from "./components/Booking/Support";
import BookingDetails from "./components/Booking/BookingDetails";
import Caland from "./components/caland/Caland";
import Sucess from "./components/sucess/Sucess";
// import ProtectedRoute from "./ProtectedRoute/ProtectedRoute"
// import StatusPage  from "./components/Booking/StatusPage"



function App({ stripePromise }) {


    return (
        <UserContextProvider>
            <div className="pt-4 px-6 md:px-12 lg:px-24">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Conditions" element={<InfoPlace />} />
                    {/* <Route path="/Condition" element={<StatusPage />} /> */}
                    <Route path="/Support" element={<Support />} />
                    <Route path="/form/:placeId" element={<Form stripePromise={stripePromise} />} />
                    <Route path="/depot-securite/:bookingId" element={<SecurityPage stripePromise={stripePromise} />} />
                    <Route path="/account/BookingDetails/:id" element={  <BookingDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/places" element={<UserPlaces />} />
                    <Route path="/account/caland" element={ <Caland />} />
                    <Route path="/account/places/new" element={  <AddPlaces />} />
                    <Route path="/account/places/:id" element={<AddPlaces />} />
                    <Route path="/places/:id" element={<PlacePage />} />
                    <Route path="/account/bookings" element={ <BookingPlces />} />
                    <Route path="/success" element={<Sucess />} />
                </Routes>

            </div>
        </UserContextProvider>
    );
}

export default App;