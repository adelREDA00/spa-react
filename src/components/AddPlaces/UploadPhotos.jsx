import React, { useState } from "react";
import {
    AiOutlineCloudUpload,
    AiOutlineStar,
    AiFillStar,
} from "react-icons/ai";
import { RiDeleteBin7Line } from "react-icons/ri";

const SERVER_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/uploads"
        : "https://spanode.onrender.com/uploads";


function UploadPhotos({ uploadPhotos, setUploadPhotos }) {
    const handleFileSelection = (ev) => {
        const files = Array.from(ev.target.files);

        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                alert("Seules les images sont autorisées.");
                return false;
            }
            return true;
        });

        setUploadPhotos((prev) => [...prev, ...validFiles]);
        ev.target.value = null; // Reset input
    };

    const deletePhoto = (ev, index) => {
        ev.preventDefault();
        setUploadPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const coverPhoto = (ev, index) => {
        ev.preventDefault();
        setUploadPhotos((prev) => [
            prev[index],
            ...prev.filter((_, i) => i !== index),
        ]);
    };

    return (
          <>
            <div className="grid gap-2 mt-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {uploadPhotos.length > 0 &&
                    uploadPhotos.map((file, index) => {
                        // Determine the src
                        const imageURL =
                            file instanceof File
                                ? URL.createObjectURL(file) // Local preview for files
                                : `${SERVER_URL}/${file}`; // Server URL for strings

                        return (
                            <div className="flex relative" key={index}>
                                <img
                                    className="rounded-2xl aspect-square object-cover"
                                    src={imageURL}
                                    alt="Uploaded preview"
                                />
                                <button
                                    onClick={(ev) => coverPhoto(ev, index)}
                                    className="bg-neutral-900 bg-opacity-60 px-2 py-1 rounded-full text-white absolute top-3 left-3"
                                >
                                    {index === 0 ? (
                                        <AiFillStar size={26} />
                                    ) : (
                                        <AiOutlineStar size={26} />
                                    )}
                                </button>
                                <button
                                    onClick={(ev) => deletePhoto(ev, index)}
                                    className="bg-neutral-900 bg-opacity-60 px-2 py-1 rounded-full text-white absolute bottom-3 right-3"
                                >
                                    <RiDeleteBin7Line size={26} />
                                </button>
                            </div>
                        );
                    })}
            </div>
            <label className="flex h-32 mt-2 max-w-lg md:max-w-xs items-center justify-center cursor-pointer gap-1 border bg-transparent rounded-2xl text-gray-500">
                <AiOutlineCloudUpload size={38} />
                Importer depuis l'appareil
                <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileSelection}
                />
            </label>
        </>
    );
}

export default UploadPhotos;
