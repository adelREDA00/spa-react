import React from "react";
import { AiOutlineWifi, AiOutlineCar } from "react-icons/ai";
import { TbToolsKitchen2 } from "react-icons/tb";
import { BsPersonWorkspace } from "react-icons/bs";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { IoSnowOutline } from "react-icons/io5";
import { LiaHotTubSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { MdOutlineBathroom } from "react-icons/md";
function Perks({ perks, setPerks }) {
    const checkboxStyle = 
        "flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer";

    const spanStyle = "text-sm";

    const handleClick = (ev) => {
        const {checked, name} = ev.target
        
        if (checked) {
            setPerks([...perks, name])
        } else {
            setPerks([...perks.filter((selectedName) => selectedName !== name)])
        }
    }

    return (
        <>
            <label className={checkboxStyle}>
                <AiOutlineWifi size={24} />
                <span className={spanStyle}>WiFi</span>
                <input
                    type="checkbox"
                    name="WiFi"
                    checked={perks.includes("WiFi")}
                    onChange={handleClick}
                />
            </label>
         
            <label className={checkboxStyle}>
                <AiOutlineCar size={24} />
                <span className={spanStyle}>Parking Gratuit</span>
                <input
                    type="checkbox"
                    name="Parking"
                    checked={perks.includes("Parking")}
                    onChange={handleClick}
                />
            </label>
            <label className={checkboxStyle}>
                <TbToolsKitchen2 size={24} />
                <span className={spanStyle}>cuisine équipé</span>
                <input
                    type="checkbox"
                    name="Kitchen"
                    checked={perks.includes("Kitchen")}
                    onChange={handleClick}
                />
            </label>
            <label className={checkboxStyle}>
                <BsPersonWorkspace size={24} />
                <span className={spanStyle}>Espace de Travail</span>
                <input
                    type="checkbox"
                    name="Work Space"
                    checked={perks.includes("Work Space")}
                    onChange={handleClick}
                />
            </label>
            <label className={checkboxStyle}>
                <PiTelevisionSimpleLight size={24} />
                <span className={spanStyle}>TV</span>
                <input
                    type="checkbox"
                    name="TV"
                    checked={perks.includes("TV")}
                    onChange={handleClick}
                />
            </label>
            <label className={checkboxStyle}>
                <IoSnowOutline size={24} />
                <span className={spanStyle}>Climatisation</span>
                <input
                    type="checkbox"
                    name="Aircondition"
                    checked={perks.includes("Aircondition")}
                    onChange={handleClick}
                />
            </label>
            <label className={checkboxStyle}>
                <LiaHotTubSolid size={24} />
                <span className={spanStyle}>Sauna</span>
                <input
                    type="checkbox"
                    name="Sauna"
                    checked={perks.includes("Sauna")}
                    onChange={handleClick}
                />
            </label>

            <label className={checkboxStyle}>
                <PiBathtub size={24} />
                <span className={spanStyle}>baignoire balnéothérapie</span>
                <input
                    type="checkbox"
                    name="baignoire"
                    checked={perks.includes("baignoire")}
                    onChange={handleClick}
                />
            </label>


            <label className={checkboxStyle}>
                <MdOutlineBathroom size={24} />
                <span className={spanStyle}>salle de bain privative</span>
                <input
                    type="checkbox"
                    name="bain"
                    checked={perks.includes("bain")}
                    onChange={handleClick}
                />
            </label>
           
        </>
    );
}

export default Perks;
