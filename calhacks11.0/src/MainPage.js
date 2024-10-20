import React, { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import PhoneInput from "./Components/PhoneInput";
import { makeOutboundCall } from "./Components/outboundcalls";
import { UserButton, useUser } from "@clerk/clerk-react";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import { firestore } from "./firebase"; // Correctly import Firestore instance
import SwitchLabels from "./Components/ModeToggle";
import Navbar from "./Components/NavBar";
import { useNavigate } from "react-router-dom";


// PhoneTextMask Component
const PhoneTextMask = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="+1 (#00) 000-0000"
      definitions={{ "#": /[1-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

PhoneTextMask.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// MainPage Component
function MainPage() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [userid, SetUserid] = useState();
  const [isMotivMode, setMotivMode] = useState(false);

  const handleModeChange = (isMotivMode) => {
    setMotivMode(isMotivMode);
    console.log(`MotivMode: ${isMotivMode}`);
  };
  const [values, setValues] = useState({
    phoneformat: "+1 (100) 000-0000",
  });
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    // If the user is signed in and has a phone number, save the entry in Firestore
    if (isSignedIn && user && user.primaryPhoneNumber) {
      const phoneNumber = user.primaryPhoneNumber.phoneNumber; // Clerk's phone number
      SetUserid(phoneNumber);

      // Create a Firestore document reference with the user's phone number as the document ID
      const userDocRef = doc(firestore, "users", phoneNumber);

      // Add the user to Firestore with phone number as the document ID
      setDoc(userDocRef, {
        phoneNumber: phoneNumber,
        language: language,
      })
        .then(() => {
          console.log("Firestore entry created for user:", phoneNumber);
        })
        .catch((error) => {
          console.error("Error creating Firestore entry:", error);
        });
    }
  }, [isSignedIn, user, language]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call makeOutboundCall with both phone number and language
    makeOutboundCall(userid, language, isMotivMode, userid);
    navigate("/history");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-10 bg-slate-100">
      <Navbar/>
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      <SwitchLabels onModeChange={handleModeChange} />
      <div>
        <h1>
          {" "}
          {isMotivMode ? "Motivation mode is active" : "Basic mode is active"}
        </h1>
      </div>

      <h1 className="text-3xl text-center text-purple-600 font-bold">
        Make a Call
      </h1>

      <label className="mb-4">
        Select Language:
        <select
          className="ml-2 p-2 border rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="zh">Mandarin</option>
          <option value="pt">Portuguese</option>
        </select>
      </label>

      <PhoneInput
        phoneNumber={userid}
        usernumber={userid}
        textMask={PhoneTextMask}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default MainPage;
