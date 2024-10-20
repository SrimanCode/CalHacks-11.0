import React, { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import PhoneInput from "./Components/PhoneInput";
import { makeOutboundCall } from "./Components/outboundcalls";
import { UserButton, useUser } from "@clerk/clerk-react";
import SwitchLabels from "./Components/ModeToggle";
import Navbar from "./Components/NavBar";
import { useNavigate } from "react-router-dom";
import FireComponent from "./Components/FireComponent";

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
  const [userid, setUserid] = useState("");
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
      setUserid(phoneNumber);
    }
  });
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure we have a valid user ID (phone number)
    if (!userid) {
      console.error("No valid user ID (phone number) available");
      return;
    }

    // Call makeOutboundCall with both phone number (userid), language, and motivation mode
    makeOutboundCall(userid, language, isMotivMode, userid);
  };

  return (
    <div
      className={`flex h-screen flex-col items-center justify-center p-10 ${
        isMotivMode ? "bg-black" : "bg-slate-100"
      } relative`}
    >
      <Navbar />

      <div
        className={
          isMotivMode
            ? "animate-shake bg-slate-200 p-10 rounded-xl drop-shadow flex flex-col max-w-fit justify-center items-center "
            : "bg-slate-200 p-10 rounded-xl drop-shadow flex flex-col w-auto justify-center items-center"
        }
      >
        <img
          src="/project-logo.png"
          alt="Logo"
          className="w-[150px] max-w-xs h-auto animate-pulse"
        />

        <div className="text-center pb-5 justify-center">
          <h1 className={isMotivMode ? "text-purple-800" : "text-green-800"}>
            {" "}
            {isMotivMode
              ? "Extra motivational mode is active"
              : "Basic mode is active"}
          </h1>
        </div>

        <div className="flex text-center justify-center">
          <label className="justify-center">
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
        </div>
        <PhoneInput
          phoneNumber=""
          usernumber={userid}
          textMask={PhoneTextMask}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <div
        className={`justify-center pt-2"${
          isMotivMode ? "bg-black" : "bg-slate-100"
        } relative`}
      >
        <SwitchLabels onModeChange={handleModeChange} />
      </div>
    </div>
  );
}

export default MainPage;
