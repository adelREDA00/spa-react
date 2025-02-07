import React from 'react'
import { IoMdClose } from "react-icons/io";

function SuccModal({ optionSucc, closeSuccModal , msg }) {
    return (
        <section className="modal container">


            <div className={`modal__container ${optionSucc ? 'show-modal' : ''}`} id="modal-container">
                <div className="modal__content ">
                    <div className="modal__close close-modal" onClick={closeSuccModal} >
                        {/* <IoMdClose size={20} /> */}
                    </div>
                    <div className="SuccCard">
                        {/* <button className="dismiss" type="button">×</button>  */}
                        <div className="header">
                            <div className="image">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>
                            <div className="content">
                                <span className="title">  {msg} </span>
                                <br />
                                <p className="message">Traitement en cours...</p>
                            </div>
                            <div className="actions">
                                {/* <button className="history" type="button" onClick={closeSuccModal} >OK</button> */}
                                {/* <button className="track" type="button">Track my package</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default SuccModal