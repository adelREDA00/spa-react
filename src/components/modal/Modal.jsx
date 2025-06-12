import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa";



const Modal = ({ showModal, closeModal , apiCreateBox,updateUIAfterBoxCreation }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [items, setItems] = useState([]);

    const [itemsInput, setItemsInput] = useState('');



    const handleItemsChange = (event) => {
        setItemsInput(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleApplyItems = () => {
        if (itemsInput.trim() !== '') {
            setItems([...items, itemsInput.trim()]); // Add the new coupon to the array
            setItemsInput(''); // Clear the input field
        }

    };


    const handleDeleteItems = (indexToDelete) => {
        setItems(items.filter((_, index) => index !== indexToDelete));
      };



    useEffect(() => {
        // Log the updated coupons list every time it changes
        console.log('Updated coupons:', items);
    }, [items]);



    // Function to handle creating a new box
const handleCreateBox = async () => {
    try {
        // Prepare the box data object
        const boxData = {
            name: name,
            description: description,
            items: items,
            price: price,
            image: image
        };

        // Make the API request to create the box
        const createdBox = await apiCreateBox(boxData);

        // Update UI with the new box data
        updateUIAfterBoxCreation(createdBox);
        
          // Close the modal after successful update
          closeModal();
         // restore the org state 
         setName("");
         setPrice("");
         setImage("");
         setDescription("");
         setItems([]);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error creating box:', error);
        // You can provide feedback to the user or handle the error in other ways
    }
};

    

    return (
        <section className="modal container">


            <div className={`modal__container ${showModal ? 'show-modal' : ''}`} id="modal-container">
                <div className="modal__content ">
                    <div className="modal__close close-modal" onClick={closeModal} >
                        <IoMdClose size={20} />
                    </div>
                    <div className="master-container">
                        <div className="card-modal cart ">
                            <label className="title">Box</label>
                            <div className="top">
                                <input value={ name} onChange={handleNameChange} type="text" placeholder="Nom de votre Box" className="input_field" />
                                <input value={ price} onChange={handlePriceChange}  type="text" placeholder="€ prix" className="input_field" />
                            </div>
                        </div>

                        <div className="card-modal coupons">
                            <label className="title">Ajouter un élément</label>
                            <div className="form"  >
                                <input type="text" name="coupon" value={ itemsInput} onChange={handleItemsChange} placeholder="Nom de l'élément" className="input_field" />
                                <div className='btn' onClick={handleApplyItems} >Ajouter</div>
                            </div>
                        </div>

                        <div className="card-modal checkout">
                            <label className="title">éléments</label>
                            <div className="details">


                                {items.map((item, index) => (
                        
                                    <div key={index} className="item">
                                    <span >{item}</span>
                                        <FaMinus className='delete' size={10} onClick={()=>{
                                            handleDeleteItems(index)
                                        }} />
                                    </div>
                                    

                              
                                ))}


                            </div>
                            <div className="checkout--footer">
                                <div onClick={handleCreateBox} className="checkout-btn">Créer</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Modal