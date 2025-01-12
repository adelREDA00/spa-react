import React from "react";
import { useLocation, Link, NavLink, useParams } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { TbHomeEdit } from "react-icons/tb";

function AccountNav() {
    const { pathname } = useLocation();
    let subpage = pathname.split('/')?.[2]
    
    if (subpage === undefined) {
        subpage = 'profile'
    }

    function linkClasses(type = null) {
        let classes = "nav-btn-main flex justify-center md:flex md:flex-row items-center gap-1 py-3 px-4 "
        if (type === subpage) {
            classes += " nav-btn text-white "
        }

        return classes
    }
  
    return (
        <div className="flex flex-col gap-3 max-w-xs md:flex md:flex-row justify-center md:max-w-global mx-auto my-16 mb-8 md:gap-4 py-2">
            <Link
                className={linkClasses('profile')}
                to={"/account"}
            >
                <CgProfile size={20} />
                Mon profil
            </Link>
            <Link
                className={linkClasses('bookings')}
                to={"/account/bookings"} 
            >
                <FaRegBookmark size={20} />
                Mes réservations
            </Link>
            <Link
                className={linkClasses('places')}
                to={"/account/places"}
            >
                <TbHomeEdit size={20} />
                Suite
            </Link>

            <Link
                className={linkClasses('caland')}
                to={"/account/caland"}
            >
                <IoCalendarNumberOutline  size={20} />
                calendrier
            </Link>
        </div>
    );
}

export default AccountNav;
