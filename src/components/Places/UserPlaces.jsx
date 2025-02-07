import React, { useEffect, useState } from "react";
import AccountNav from "../Account/AccountNav";
import { Link } from "react-router-dom";
import * as api from "../../api/requester";
import { TbHomePlus } from "react-icons/tb";
import ClipLoader from "react-spinners/ClipLoader";

const URL_TO_UPLOADS =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/uploads/"
        : "https://spanode.onrender.com/uploads/";

function Places() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    async function getUserPlaces() {
        try {
            const response = await api.getUserPlaces();
            if (Array.isArray(response)) {
                setPlaces(response);
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Failed to fetch places:", error);
        } finally {
            setLoading(false); // Stop loading after API call
        }
    }

    useEffect(() => {
        getUserPlaces();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-32">
              <ClipLoader className="mb-4" />
              <span>Loading...</span>
            </div>
          );
    }

    return (
        <div className="max-w-global mx-auto">
            <AccountNav />
            <div className="flex items-center justify-center mt-12">
                <Link
                    to={"/account/places/new"}
                    className="nav-btn-add text-white py-3 px-5"
                >
                    <TbHomePlus size={24} />
                </Link>
            </div>
            <div className="mt-12 mb-12">
                {places.length > 0 ? (
                    places.map((place) => (
                        <Link
                            to={`/account/places/${place._id}`}
                            key={place._id}
                            className="flex flex-col md:flex-row gap-4 mt-4 bg-gray-100 hover:shadow-md shadow-black transition duration-300 ease-in-out p-4"
                        >
                            <div className="flex max-w-full h-46 md:max-w-[320px] md:h-44 bg-gray-300 shrink-0">
                                <img
                                    className="object-fill aspect-auto max-h-[320px] md:aspect-square md:w-64"
                                    src={
                                        place.photos && place.photos[0]
                                            ? URL_TO_UPLOADS + place.photos[0]
                                            : "/fallback-image.jpg" // Fallback image
                                    }
                                    alt={place.title || "Place"}
                                    loading="lazy" // Lazy loading for performance
                                />
                            </div>
                            <div className="flex flex-col gap-3 grow-0 shrink max-h-44 overflow-hidden">
                                <h2 className="font-semibold text-lg">
                                    {place.title}
                                </h2>
                                <p className="text-sm">{place.description}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        No places found. Add a new place to get started!
                    </p> // Fallback UI for no places
                )}
            </div>
        </div>
    );
}

export default Places;
