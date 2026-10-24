import React from "react";
const logo = "/brand/icon.svg";
import { Link } from "react-router-dom";


const NotFound = () => {

  return (
    <div className="flex flex-col items-center justify-center p-8 text-white bg-[#0A0A0A]">

      <img src={logo} alt="Keylilt logo" className="h-32 w-32 mb-6" />

      <h1 className="text-[50px] font-light text-white font-[Pavanam] ">404 PAGE NOT FOUND</h1>
        <Link to="/">
            <p  className="text-[#C7FF65] hover:underline">Click here</p>
        </Link>
    </div>
  );
};

export default NotFound;
