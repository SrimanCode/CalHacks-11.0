import React, { useState } from "react";
import PhoneInput from "./Components/PhoneInput";
import { makeOutboundCall } from "./Components/outboundcalls";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    makeOutboundCall(phoneNumber);
  };

  return (
    <div>
      <h1>Make a Call</h1>
      <PhoneInput
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default App;
