import React, { useEffect, useState } from "react";
import BookingWidget from "./BookingWidget";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineWifi, AiOutlineCar } from "react-icons/ai";
import { TbToolsKitchen2 } from "react-icons/tb";
import { BsPersonWorkspace } from "react-icons/bs";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { IoSnowOutline } from "react-icons/io5";
import { MdNightlightRound } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
import * as api from "../../api/requester";
import { LiaHotTubSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { MdOutlineBathroom } from "react-icons/md";

function PlacePageDetails({ place }) {
    //BOXES LIST 
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //FETCH THE BOXES
    useEffect(() => {
        const fetchBoxes = async () => {
            setLoading(true);
            setError(null); // Reset error before fetching

            try {
                const data = await api.getBoxes();
                setBoxes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();

    }, []);

    return (
        <div className="flex flex-col gap-6  md:flex-row md:gap-16 mt-8">
            <div className="w-full md:w-[55%]">
                <div className="border-t-2 mb-6" />
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{place.description}</p>

                <div className="mt-6 ">
                    <h2 className="text-xl font-semibold mb-2">Périodes de location</h2>
                </div>


                <div className="mt-6 periodes">
                    <h3 > <strong className="fornow">  <IoIosSunny className="Icon-DayNightClient" />  Après-midi</strong> </h3>
                    <p>Arrivée : 13:00</p>
                    <p>Départ : 17:00</p>
                    <p  >Tarif week-end: <span className=" title-2" >125 €</span> </p>
                    <p>Tarif semaine: <span className=" title-2" >95 €</span> </p>
                    
                </div>

                
                <div className="mt-6 periodes">
                <h3 > <strong className="fornow" ><MdNightlightRound className="Icon-DayNightClient" /> Nuit</strong> </h3>
                    <p>Arrivée : 19:00</p>
                    <p>Départ : 11:00</p>
                    <p  >Tarif week-end: <span className=" title-2" >184 €</span> </p>
                    <p>Tarif semaine: <span className=" title-2" >152 €</span> </p>
                    
                </div>


                <div className="border-t-2 mt-6" />
                <h2 className="mt-8 text-xl font-semibold">
                  Ce que l'endroit offre
                </h2>
                <div className="grid grid-cols-2 mt-2 gap-1">
                    {/* {place.perks.map((perk) => (
                        <p key={perk}>{perk}</p>
                    ))} */}

                    <p className="flex items-center  gap-2 py-3 cursor-pointer"><AiOutlineWifi size={24} />Wifi</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer"> <AiOutlineCar size={24} />Parking Gratuit</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">  <TbToolsKitchen2 size={24} />cuisine équipé</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">  <BsPersonWorkspace size={24} />Espace de Travail</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer"><PiTelevisionSimpleLight size={24} />TV</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">   <IoSnowOutline size={24} />Climatisation</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">   <LiaHotTubSolid  size={24} />Sauna</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">   <PiBathtub   size={28} />baignoire balnéothérapie</p>
                    <p className="flex items-center  gap-2 py-3 cursor-pointer">   <MdOutlineBathroom  size={24} />salle de bain privative</p>
                   

                    
                </div>

                <h2 className="mt-8 text-xl font-semibold">
                    BOX DÉTENTE
                </h2>
                <div className="grid grid-cols-2 mt-2 gap-1 grid-list">
                    {loading && (

                        <ClipLoader className="mb-4" />

                    )}
                    {error && <div>Error loading boxes: {error}</div>}
                    {!loading && boxes.length > 0 ? (


                        boxes.map(box => (


                            <div key={box._id} className="bg-gray-100 menu-card hover:card  border  ">
                                <div>
                                    <div  className="title-wrapper">
                                        {/* <h3 className="title-3">
                    <a href="#" className="card-title">{box.name}</a>
                  </h3> */}
                                        {/* <span className="span title-2"> {box.price} € </span><br /> */}
                                        <span className="label-1">{box.name}</span> 
                                        
                                    </div>
                                    <p className="card-text ">
                                        {Array.isArray(box.items) ? box.items.join(', ') : 'No items available'}
                                    </p>
                                </div>
                            </div>

                        ))
                    ) : !loading && (

                        <span>No boxes available</span>

                    )}
                </div>
                <div className="border-t-2 mt-6 mb-6" />
                <h2 className="text-xl font-semibold">Extra Info</h2>
                <p className="mt-2">{place.extraInfo}</p>
                <div className="border-t-2 mt-6 mb-6" />
            </div>
            <div className="border rounded-2xl shadow-lg shadow-gray-300 w-full md:w-[45%] md:h-[30%] px-6 mb-8">
                <BookingWidget place={place} />
            </div>
        </div>
    );
}

export default PlacePageDetails;
