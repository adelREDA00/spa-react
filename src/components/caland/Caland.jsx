import React, { useState, useEffect } from "react";
import AccountNav from "../Account/AccountNav";
import * as api from "../../api/requester";
import { Calendar, Badge } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

// Helper function to format the date into a string like "YYYY-MM-DD"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Caland = () => {
  const [places, setPlaces] = useState([]); // Store available places
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the selected place
  const [bookings, setBookings] = useState({}); // Store bookings for the selected place
  const [isBookingsLoaded, setIsBookingsLoaded] = useState(false); // Track if bookings are loaded

  // Fetch all places (IDs and Names)
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesData = await api.getPlacesIds(); // Your API call to fetch places
        setPlaces(placesData);
        if (placesData.length > 0) {
          setSelectedPlace(placesData[0]._id); // Default to the first place
        }
        console.log("placesData", placesData);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  // Fetch bookings for the selected place
  useEffect(() => {
    if (!selectedPlace) return;

    const fetchBookings = async () => {
      try {
        const { bookedSlots } = await api.fetchBookedDates(selectedPlace); // Fetch by place ID
        setBookings(bookedSlots);
        setIsBookingsLoaded(true); // Mark that bookings are loaded
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setIsBookingsLoaded(false); // Reset loading state on error
      }
    };

    fetchBookings();
  }, [selectedPlace]); // Triggered whenever the selected place changes

  // Function to get bookings for a specific date
  const getEventList = (date) => {
    const dateString = formatDate(date);
    return bookings[dateString] || [];
  };

  // Render bookings inside calendar cell
  const renderCell = (date) => {
    const events = getEventList(date);

    if (events.length > 0) {
      return (
        <ul className="calendar-todo-list">
          {events.map((event, index) => (
            <Link
              className="BookLink"
              key={index}
              to={
                event.id === null
                  ? "/account/bookings"
                  : `/account/BookingDetails/${event.id}`
              }
            >
              <Badge /> <b>{event.timeSlot}</b> - {event.name}
            </Link>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="max-w-global mx-auto">
      <AccountNav />
      <div className="mt-12 mb-12">
        {/* Radio buttons to toggle places */}
        <div className="radio-inputs">
          {places.map((place) => (
            <label className="radio" key={place._id}>
              <input
                type="radio"
                name="place"
                value={place._id}
                checked={selectedPlace === place._id}
                onChange={() => setSelectedPlace(place._id)}
              />
              <span className="name">{place.title}</span>
            </label>
          ))}
        </div>

        {/* Conditionally render the Calendar or loading indicator */}
        {isBookingsLoaded ? (
          <Calendar bordered renderCell={renderCell} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-32">
          <ClipLoader className="mb-4" />
          <span>Loading...</span>
        </div>
        )}
      </div>
    </div>
  );
};

export default Caland;