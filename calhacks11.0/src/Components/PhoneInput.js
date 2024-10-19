import React from "react";

const PhoneInput = ({ phoneNumber, setPhoneNumber, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
        required
      />
      <button type="submit">Call</button>
    </form>
  );
};

export default PhoneInput;
