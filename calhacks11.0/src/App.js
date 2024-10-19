
import Button from "@mui/material/Button";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import React, { useState } from "react";
import PhoneInput from "./Components/PhoneInput";
import { makeOutboundCall } from "./Components/outboundcalls";

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

function App() {
  const [values, setValues] = useState({
    phoneformat: "+1 (100) 000-0000",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    // testing, please remove
  };

  const handleSubmit2 = () => {
    console.log(
      values.textmask.replace("-", "").replace(/\s+/g, "").replace(/[()]/g, "")
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    makeOutboundCall(phoneNumber);
  };


  return (
    <div className="flex h-screen flex-col items-center justify-center p-10 bg-slate-100">
      <h1 className="text-3xl text-center text-purple-600 font-bold pb-10">
        Treelungo
      </h1>
      <div className="w-max">
        <FormControl variant="standard" onSubmit={handleChange}>
          <InputLabel htmlFor="formatted-text-mask-input">
            Enter phone number
          </InputLabel>
          <Input
            value={values.textmask}
            name="textmask"
            id="formatted-text-mask-input"
            inputComponent={PhoneTextMask}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit2}>Get a call</Button>
        </FormControl>

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
