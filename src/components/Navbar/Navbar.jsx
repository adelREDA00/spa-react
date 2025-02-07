import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navMenuRef = useRef(null);

    const handleOpenMenu = () => {
        setIsMenuOpen(true); // Open the menu
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false); // Close the menu
    };

    const handleClickOutside = (event) => {
        // Close menu if click happens outside of the menu
        if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
            handleCloseMenu();
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            // Add event listener for clicks outside the menu
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Remove event listener when menu is closed
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="navbar-section">
            <div className="flex justify-between max-w-global mx-auto">
                <Link to={"/"} className="menu-icon">
                    <img src="/assets/images/logonav.svg" id="logo-img" alt="Logo" />
                </Link>
                <Link
                    to="#"
                    aria-label="User"
                    className="menu-icon"
                    onClick={handleOpenMenu}
                >
                    <CiMenuFries className="m-icon" size={24} />
                </Link>
            </div>

            <header className={`header ${isMenuOpen ? "active" : ""}`} id="header">
                <nav className="nav container">
                    <div
                        className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
                        ref={navMenuRef}
                    >
                        <ul className="nav__list">
                            <li className="nav__item">
                                <Link className="nav__link" to="/" onClick={handleCloseMenu}>Accueil</Link>
                            </li>
                            <li className="nav__item">
                                <Link className="nav__link" to="/Conditions" onClick={handleCloseMenu}>
                                    Conditions Générales
                                </Link>
                            </li>
                            <li className="nav__item">
                                <a
                                    className="nav__link"
                                    href="https://privatesuitespalyon.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleCloseMenu}
                                >
                                    Site Principal
                                </a>
                            </li>
                            <li className="nav__item">
                                <Link className="nav__link" to="/Support" onClick={handleCloseMenu}>contact</Link>
                            </li>
                        </ul>
                        <div onClick={handleCloseMenu} className="nav__close" id="nav-close">
                            <IoClose id="Io-close" size={24} />
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Navbar;
