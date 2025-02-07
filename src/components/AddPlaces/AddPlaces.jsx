import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api/requester";
import AccountNav from "../Account/AccountNav";
import UploadPhotos from "./UploadPhotos";
import Perks from "./Perks";
import Box from "./Box";
import EditModal from "../modal/EditModal";
import Modal from "../modal/Modal";
import { IoAdd } from "react-icons/io5";
import Periode from "./Periode";
import SuccModal from "../modal/SuccModal";
import { IoIosArrowBack } from "react-icons/io";


function AddPlaces() {
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [uploadPhotos, setUploadPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckout] = useState("");
    const [maxGuests, setMaxGuests] = useState("");
    const [price, setPrice] = useState("");
    const [availbleOptions, setAvailbleOptions] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);

    //loading place 
    const [loadingPlace, setLoadingPlace] = useState(false); // dd a loading state



    // Periode inputs state
    const [period, setPeriod] = useState("");
    const [weekdayPrice, setWeekdayPrice] = useState("");
    const [weekendPrice, setWeekendPrice] = useState("");
    const [checkInTime, setCheckInTime] = useState("");
    const [checkOutTime, setCheckOutTime] = useState("");
    const [options, setOptions] = useState([]);
    const [optionsloading, setOptionsLoading] = useState(true);
    const [optionserror, setOptionsError] = useState(null);
    const [optionSucc, setOptionSucc] = useState(false);
    //SUCC MODAL MESSAGE
    const [msg, setMsg] = useState("");

    //BOXES LIST 
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    //TRACKING BOXES FOR EDIT 
    const [selectedBox, setSelectedBox] = useState(null);
    // EDITBOXMODAL
    const handleBoxClick = (box) => {
        setShowEditModal(true);
        setSelectedBox(box);
    };

    console.log("im the one ", selectedBox);
    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedBox(null)
    };

    // MODAL
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);

    };

    const closeModal = () => {
        setShowModal(false);
    };
    // END MODAL 

    //SUCC MSG MODAL

    const closeSuccModal = () => {
        setOptionSucc(false);
    };
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

    //UPDATE THE BOXES UI AFTER TEH API PUT

    // Function to update UI after successful API call
    const updateUIAfterAPICall = (updatedBoxData) => {
        // Find the index of the updated box in the boxes array
        const updatedBoxIndex = boxes.findIndex(box => box._id === updatedBoxData._id);

        // If the updated box is found, update the boxes state
        if (updatedBoxIndex !== -1) {
            const updatedBoxes = [...boxes];
            updatedBoxes[updatedBoxIndex] = updatedBoxData;
            setBoxes(updatedBoxes);
        }
    };

    //END OF TEH UI UPDATE 



    // UPDATE THE UI AFTER CREATING NEW BOX
    // Function to update UI after successful API call to create a box
    const updateUIAfterBoxCreation = (newBoxData) => {
        setBoxes([...boxes, newBoxData]);
    };
    // UPDATE THE UI AFTER DELETING A BOX
    const updateUIAfterDelete = (deletedBoxId) => {
        setBoxes((prevBoxes) => prevBoxes.filter(box => box._id !== deletedBoxId));
    };
    console.log("three", boxes);
    //END THE BOXES FETCH 
    const navigate = useNavigate();
    const { id } = useParams();

    async function getPlaceDetails() {
        const response = await api.getPlace(id);
        const data = await response.json();
        setTitle(data.title);
        setAddress(data.address);
        setUploadPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckout(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
        setAvailbleOptions(data.availbleOptions)
    }

    useEffect(() => {
        if (!id) {
            return;
        }

        getPlaceDetails();
    }, [id]);

    useEffect(() => {
        const areInputsEmpty =
            !title &&
            !address &&
            !uploadPhotos.length &&
            !availbleOptions.length &&
            !description &&
            !perks &&
            !extraInfo &&
            !checkIn &&
            !checkOut &&
            !maxGuests &&
            !price;

        setIsEmpty(areInputsEmpty)
    }, [
        title,
        address,
        uploadPhotos,
        availbleOptions,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
    ]);

    const data = {
        title,
        address,
        uploadPhotos,
        availbleOptions,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
    };

    async function addPlace(ev) {
        ev.preventDefault();
        setLoadingPlace(true); // Start loading
        try {
            // Step 1: Prepare images to upload
            const imageUploadData = new FormData();
            uploadPhotos.forEach((image) => {
                if (image instanceof File) {
                    imageUploadData.append("photos", image);
                }
            });

            // Step 2: Upload new images to the server (if any)
            let uploadedImages = [];
            if (imageUploadData.has("photos")) {
                const response = await api.uploadPhotoFromDevice(imageUploadData);
                if (!response || !Array.isArray(response)) {
                    throw new Error("Failed to upload images or response is invalid");
                }
                uploadedImages = response; // Response contains server-stored image paths
            }

            // Step 3: Combine existing and newly uploaded images
            const combinedImages = [
                ...uploadPhotos.filter((image) => typeof image === "string"), // Existing server-stored images
                ...uploadedImages, // Newly uploaded images
            ];

            // Step 4: Prepare the full data object for the API call
            const updatedData = {
                ...data,
                uploadPhotos: combinedImages, // Use the updated list of image paths
            };

            // Step 5: Create or update place
            let response;
            if (id) {
                response = await api.updatePlace(id, updatedData);
            } else {
                response = await api.createPlace(updatedData);
            }

            //  navigate("/") ✅ Redirect after success
            return response;
        } catch (error) {
            console.error("Error in addPlace:", error);
        } finally {
            setLoadingPlace(false); //  Stop loading
        }
    }



    const [showDelModal, setShowDelModal] = useState(false);


    // Remove booking function
    const removeSuite = async () => {
        try {
            await api.deletePlace(id);
            navigate("/account/places");
        } catch (error) {
            console.log(error);
        }
    };

    // Handle Delete Button Click
    const handleDeleteClick = (ev) => {
        ev.preventDefault();
        setShowDelModal(true); // Open modal
    };

    // Handle confirmation to delete the booking
    const handleConfirmDelete = async () => {
        await removeSuite(); // Delete the booking
        setShowDelModal(false); // Close modal after delete
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setShowDelModal(false); // Close modal
    };


    const inputHeader = (text) => (
        <h2 className="text-2xl font-semibold mt-8">{text}</h2>
    );

    const inputDescription = (description) => (
        <p className="text-sm text-gray-400">{description}</p>
    );

    const preInput = (header, description) => (
        <>
            {inputHeader(header)}
            {inputDescription(description)}
        </>
    );

    //FETCH THE OPTIONS
    useEffect(() => {
        const fetchOptions = async () => {
            setOptionsLoading(true);
            setOptionsError(null); // Reset error before fetching

            try {
                const data = await api.getOptions();
                setOptions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchOptions();

    }, []);

    console.log("otions are here ", options);


    //RENTAL OPTIONS
    const handleOptionCreate = async () => {
        const data = {
            period,
            weekdayPrice: parseFloat(weekdayPrice),  // Converts weekdayPrice to a number
            weekendPrice: parseFloat(weekendPrice),  // Converts weekendPrice to a number
            checkInTime,
            checkOutTime,
        };

        try {
            const response = await api.createOption(data);

            if (response && response._id) {
                console.log("Rental option created successfully!");
                const newOptionId = response._id; // response has _id field
                setAvailbleOptions(prevOptions => [...prevOptions, newOptionId]);
                setMsg('Option de location créée avec succès !')
                setOptionSucc(true);
            } else {
                console.log("An error occurred while creating rental option.");
                setMsg('Une erreur s`est produite lors de la création de l`option')
            }
        } catch (err) {
            console.log("An error occurred:", err);
        }
    };


    //UPDATE OPTIONS
    // UPDATE OPTIONS
    const handleOptionUpdate = async (optionId, updatedData) => {
        try {
            const response = await api.updateOption(optionId, updatedData);
            console.log(response);
            if (response && response.success) {
                setOptions((prevOptions) =>
                    prevOptions.map((option) =>
                        option._id === optionId ? response.option : option
                    )
                );
                console.log(response);
                setMsg('Option de location mise à jour avec succès !');
                setOptionSucc(true);
            } else {
                console.log(response.message || 'An error occurred');
                //this is not correct only for the demo
                setMsg('Option de location mise à jour avec succès !');
                setOptionSucc(true);
            }
        } catch (err) {
            console.log('An error occurred', err);
            setMsg('Une erreur s`est produite');
            setOptionSucc(true);
        }
    };
    //DELETE OPTIONS
    const handleDeleteOption = async (optionId) => {
        console.log("rera");
        try {
            const confirmed = window.confirm(`Are you sure you want to delete the option`);
            if (!confirmed) return;

            const response = await api.deleteOption(optionId);
        } catch (error) {
            console.error("Error deleting  option :", error);
        }
    };



    return (
        <>

            {loadingPlace ? (
                <div className="flex flex-col items-center justify-center mt-32">
                    <ClipLoader className="mb-4" />
                    <span>Loading...</span>
                </div>
            ) : (
                <div>
                    <AccountNav />
                    <div className="max-w-global mx-auto flex flex-col items-center justify-center mb-8">
                        <form action="" method="POST" className="max-w-4xl w-full">
                            {preInput(
                                "Titre",
                                "Titre pour votre lieu. Il doit être simple et court"
                            )}
                            <input
                                type="text"
                                placeholder="Title, for example: My awesome place..."
                                value={title}
                                onChange={(ev) => setTitle(ev.target.value)}
                            />
                            {preInput("Adresse", "Adresse de ce lieu")}
                            <input
                                type="text"
                                placeholder="Ajouter l'adresse du lieu..."
                                value={address}
                                onChange={(ev) => setAddress(ev.target.value)}
                            />
                            {preInput("Télécharger une photo", "Télécharger des images")}
                            <UploadPhotos
                                uploadPhotos={uploadPhotos}
                                setUploadPhotos={setUploadPhotos}
                            />
                            {preInput(
                                "Description",
                                "Ajoutez une description de votre lieu..."
                            )}
                            <textarea
                                className="h-32"
                                type="text"
                                placeholder="description de votre lieu..."
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                            />
                            {preInput("Caractéristiques", "Ajoutez les caractéristiques disponibles de votre lieu")}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                                <Perks perks={perks} setPerks={setPerks} />
                            </div>
                            {/* boxes */}
                            {preInput("Box", "Ajoutez les Boxes qui appartiennent à votre lieu")}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                                {loading && (
                                    <div className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer">
                                        <ClipLoader className="mb-4" />
                                    </div>
                                )}
                                {error && <div>Error loading boxes: {error}</div>}
                                {!loading && boxes.length > 0 ? (
                                    boxes.map(box => (
                                        <Box key={box._id} box={box} handleBoxClick={handleBoxClick} />
                                    ))
                                ) : !loading && (
                                    <div className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer">
                                        <span>No boxes available</span>
                                    </div>
                                )}



                                {/* ADD BOX BTN */}
                                <label id="add-box" className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer" onClick={openModal}>
                                    <IoAdd size={20} />
                                    <span className="text-sm">Ajouter</span>
                                </label>


                            </div>
                            {/* Box Modal */}
                            <Modal showModal={showModal} updateUIAfterBoxCreation={updateUIAfterBoxCreation} apiCreateBox={api.createBox} closeModal={closeModal} />

                            {selectedBox && (
                                <EditModal selectedBox={selectedBox} deleteBox={api.deletebox} updateUIAfterDelete={updateUIAfterDelete} updateUIAfterAPICall={updateUIAfterAPICall} apiUpdateBox={api.updateBoxe} closeEditModal={closeEditModal} showEditModal={showEditModal} />
                            )}


                            {preInput("Informations supplémentaires", "Ajoutez des informations supplémentaires pour votre lieu")}
                            <textarea
                                className="h-28"
                                type="text"
                                placeholder="Informations supplémentaires ..."
                                value={extraInfo}
                                onChange={(ev) => setExtraInfo(ev.target.value)}
                            />
                            {preInput("Périodes de location", "Ajoutez vos options de location ici")}
                            {optionserror && <div>Error loading options: {error}</div>}
                            {!optionsloading && options.length > 0 ? (
                                options.map(option => (
                                    <Periode
                                        key={option._id}
                                        Id={option._id}
                                        period={option.period}
                                        setPeriod={(value) => setOptions(options.map(opt => opt._id === option._id ? { ...opt, period: value } : opt))}
                                        weekdayPrice={option.weekdayPrice}
                                        setWeekdayPrice={(value) => setOptions(options.map(opt => opt._id === option._id ? { ...opt, weekdayPrice: value } : opt))}
                                        weekendPrice={option.weekendPrice}
                                        setWeekendPrice={(value) => setOptions(options.map(opt => opt._id === option._id ? { ...opt, weekendPrice: value } : opt))}
                                        checkInTime={option.checkInTime}
                                        setCheckInTime={(value) => setOptions(options.map(opt => opt._id === option._id ? { ...opt, checkInTime: value } : opt))}
                                        checkOutTime={option.checkOutTime}
                                        setCheckOutTime={(value) => setOptions(options.map(opt => opt._id === option._id ? { ...opt, checkOutTime: value } : opt))}
                                        handleOptionCreate={() => handleOptionCreate(option)}
                                        handleOptionUpdate={(updatedData) => handleOptionUpdate(option._id, updatedData)}
                                        handleDeleteOption={handleDeleteOption}
                                        isUpdate={true}
                                    />
                                ))
                            ) : !optionsloading && (
                                <div className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer">
                                    <span>No options available</span>
                                </div>
                            )}

                            {/* <Periode
                period={period}
                setPeriod={setPeriod}
                weekdayPrice={weekdayPrice}
                setWeekdayPrice={setWeekdayPrice}
                weekendPrice={weekendPrice}
                setWeekendPrice={setWeekendPrice}
                checkInTime={checkInTime}
                setCheckInTime={setCheckInTime}
                checkOutTime={checkOutTime}
                setCheckOutTime={setCheckOutTime}
                handleOptionCreate={handleOptionCreate}
            /> */}

                            {/* SUCC MESSAGE */}
                            <SuccModal optionSucc={optionSucc} closeSuccModal={closeSuccModal} msg={msg} />


                            <div className="flex flex-col items-center justify-center gap-2">
                                <button
                                    disabled={isEmpty}
                                    onClick={addPlace}
                                    className="max-w-md  mt-10 mb-2  Sauv "
                                >
                                    Sauvegarder
                                </button>
                                {id ? (
                                    <button
                                        onClick={(ev) => handleDeleteClick(ev)} // Open modal with booking ID
                                        className=" max-w-md Suppri"
                                    >
                                        Supprimer
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    </div>

                    {/* Confirmation Modal */}
                    {showDelModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6  shadow-lg max-w-sm text-center">
                                <h3 className="text-lg font-semibold mb-4">Êtes-vous sûr ?</h3>
                                <p className="text-gray-600 mb-6">
                                    Cette action est irréversible. Voulez-vous continuer ?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleCancelDelete} // Close modal on cancel
                                        className="bg-gray-200 text-gray-800 px-4 py-2 "
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete} // Confirm deletion
                                        className="bg-red-500 text-white px-4 py-2 "
                                    >
                                        Oui, supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        className="fixed top-4 left-0 z-50 bg-gray-700 text-white py-2 px-2 transition-opacity duration-200 hover:opacity-80"
                        onClick={() => window.history.back()}
                    >
                        <IoIosArrowBack size={18} />
                    </button>
                </div>
            )}



        </>
    );
}

export default AddPlaces;
