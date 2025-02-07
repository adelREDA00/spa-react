import React from 'react';
import { TbToolsKitchen2 } from "react-icons/tb";

function Box({ box ,handleBoxClick }) {


    const handleBoxClickFunc = () => {
        handleBoxClick(box);
    };
    return (
        <>
            <label className="flex items-center justify-center border rounded-2xl gap-2 py-3 cursor-pointer box"   >

                <div className="boxInfo" onClick={handleBoxClickFunc} >
                    <span>
                    <TbToolsKitchen2 size={24} />
                    </span>
                    <span className="text-sm"> {box.name} </span>
                </div>
            </label>
        </>
    );
}

export default Box;
