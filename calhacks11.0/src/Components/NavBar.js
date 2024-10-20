import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className=" bg-gray-800 p-4 w-full fixed top-0">
      <div className="container mx-auto justify-start">
        <Link to="/main" className="mr-4 text-white hover:underline">
          Home
        </Link>
        <Link to="/history" className="text-white hover:underline">
          History
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
