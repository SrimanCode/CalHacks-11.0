import React from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 w-full fixed top-0">
      <div className="flex justify-between items-centergap-4">
        <div className="flex gap-4">
          <Link to="/main" className="text-white hover:underline">
            Home
          </Link>
          <Link to="/history" className="text-white hover:underline">
            History
          </Link>
        </div>
        <UserButton />
      </div>
    </nav>
  );
}

export default Navbar;
