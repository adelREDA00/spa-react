import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FiSend } from "react-icons/fi";



function Support() {
  return (
    <div className="max-w-global mx-auto supp ">
      <section id="contact">
        <h1 className="section-header">Contact</h1>

        <div className="contact-wrapper">
          {/* Left contact page */}
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

          {/* Right contact page */}
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
      </section>
    </div>
  );
}

export default Support;
