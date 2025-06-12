import React from "react";


const imageUrl = process.env.NODE_ENV === 'development' 
  ? '/api/uploads'
  : '/api/uploads';


function DisplayPhotos({ uploadPhotos }) {


    return (
        <>
            <div className="flex flex-col gap-2 mt-6 lg:flex-row lg:flex-wrap">
                {uploadPhotos.length > 0 &&
                    uploadPhotos.map((file, index) => {
                        // Determine the src
                        const imageURL =
                            file instanceof File
                                ? URL.createObjectURL(file) // Local preview for files
                                : `${imageUrl}/${file}`; // Server URL for strings

                        return (
                            <div className="flex relative w-full md:w-48" key={index}>
                                <img
                                    className="w-full h-full object-contain"
                                    src={imageURL}
                                    alt="Uploaded preview"
                                />

                            </div>
                        );
                    })}
            </div>

        </>
    );
}

export default DisplayPhotos;
