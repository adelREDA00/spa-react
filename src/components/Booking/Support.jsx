import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { TbWorldShare } from "react-icons/tb";



function Support() {
  return (
    <div className="max-w-global mx-auto supp ">
      {/* <section id="contact">
        <h1 className="section-header">Contact</h1>

        <div className="contact-wrapper">
      
          <form id="contact-form" className="form-horizontal" role="form">
            <div className="form-group">
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="nom"
                  name="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-12">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="@email"
                  name="email"
                  required
                />
              </div>
            </div>

            <textarea
              className="form-control"
              rows="10"
              placeholder="message"
              name="message"
              required
            ></textarea>

            <button className="btn  send-button" id="submit" type="submit">
              <FiSend />
              <span className="send-text">envoyer</span>
            </button>
          </form>

          
          <div className="direct-contact-container">
            <ul className="contact-list">


              <li className="list-item">
                <FaInstagram />
                <span className="contact-text phone">
                  <a href="tel:1-212-555-5555" title="Give me a call">
                    privatespa.ig.com
                  </a>
                </span>
              </li>

              <li className="list-item">
                <MdAlternateEmail />
                <span className="contact-text gmail">
                  <a href="mailto:hitmeup@gmail.com" title="Send me an email">
                    hitmeup@gmail.com
                  </a>
                </span>
              </li>
            </ul>

            <hr />
            <ul className="social-media-list">
              <li>
                <a href="#" target="_blank" className="contact-icon" rel="noreferrer">
                  <MdAlternateEmail />

                </a>
              </li>
              <li>
                <a href="#" target="_blank" className="contact-icon" rel="noreferrer">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" className="contact-icon" rel="noreferrer">
                  <FaSnapchat />
                </a>
              </li>
            </ul>
            <hr />

            <div className="copyright">&copy; Tous droits réservés</div>
          </div>
        </div>
      </section> */}

      <div className="mt-12">
        <h1 className="section-header"> Contact</h1>
        {/* <p >  Nos Règles pour un Séjour Agréable</p> */}


        <div className="bg-gray-100  text-sm md:text-base px-2 md:px-6 py-4 mt-2">
          <h3 className=" mb-2 sou-title">
            <MdAlternateEmail size={20} />   Email
          </h3>
          <div className="mt-4">

            <p className="text-base">
            Privatesuite.spa@gmail.com
            </p>

          </div>
        </div>

        <br />

     <a href="https://www.instagram.com/privatesuite.spa" target="_blank" rel="noopener noreferrer">
     
     <div className="bg-gray-100  text-sm md:text-base px-2 md:px-6 py-4 mt-2">
          <h3 className="mb-2 sou-title">
            <FaInstagram size={20} />
            Instagram 
          </h3>
          <div className="flex flex-row items-center text-gray-500">

            <p className="mr-3">

              privatesuite.spa


            </p>


          </div>

        </div>

     </a>


      </div>



      <div className=" mt-6" />

      <a href="https://privatesuitespalyon.fr" target="_blank" rel="noopener noreferrer">

        <div className="bg-gray-100  text-sm md:text-base px-2 md:px-6 py-4 mt-2">
          <h3 className="mb-2 sou-title">
            <TbWorldShare size={20} />
            Site principal 
          </h3>
          <div className="flex flex-row items-center text-gray-500">

            <p className="mr-3">

              www.privatesuitespalyon.fr


            </p>


          </div>

        </div>
      </a>





    </div>
  );
}

export default Support;
