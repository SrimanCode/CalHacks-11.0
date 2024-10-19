import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import PhoneInput from "./Components/PhoneInput";
import React, { useState } from "react";
import { makeOutboundCall } from "./Components/outboundcalls";
import SwitchLabels from "./Components/ModeToggle";

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

function MainPage() {
  const [isMotivMode, setMotivMode] = useState(false);

  const handleModeChange = (isMotivMode) => {
    setMotivMode(isMotivMode);
    console.log(`MotivMode: ${isMotivMode}`);
  };

  const [values, setValues] = useState({
    phoneformat: "+1 (100) 000-0000",
  });
  const [language, setLanguage] = useState("es"); // Default to Spanish

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    // testing, please remove
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the phone number to remove unnecessary characters
    const processedPhoneNumber = values.textmask
      .replace("-", "")
      .replace(/\s+/g, "")
      .replace(/[()]/g, "");

    // Call makeOutboundCall with both phone number and language
    makeOutboundCall(processedPhoneNumber, language, isMotivMode);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-10 bg-slate-100">
      <SwitchLabels onModeChange={handleModeChange} />
      <div>
        <h1>
          {" "}
          {isMotivMode ? "Motivation mode is active" : "Basic mode is active"}
        </h1>
      </div>
      <h1 className="text-3xl text-center text-purple-600 font-bold">
        Make a call
      </h1>
      <label>
        Select Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="es">Spanish</option>
          <option value="zh">Mandarin</option>
          <option value="pt">Portuguese</option>
        </select>
      </label>

      <PhoneInput
        phoneNumber={values.textmask}
        textMask={PhoneTextMask}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default MainPage;
