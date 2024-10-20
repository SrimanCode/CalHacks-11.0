import React from "react";
import Navbar from "./Components/NavBar"; // Make sure to import the navbar

function History() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <Navbar />
      <h1 className="text-3xl font-bold">Call History</h1>
      {/* Add content to display call history here */}
    </div>
  );
}

export default History;
