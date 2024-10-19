import React from "react";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
const PhoneInput = ({ phoneNumber, textMask, handleChange, handleSubmit }) => {
  return (
    <div>
      <FormControl variant="standard" onSubmit={handleSubmit}>
        <InputLabel htmlFor="formatted-text-mask-input">
          Enter phone number
        </InputLabel>
        <Input
          value={phoneNumber}
          name="textmask"
          id="formatted-text-mask-input"
          inputComponent={textMask}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit}>Get a call</Button>
      </FormControl>
    </div>
  );
};

export default PhoneInput;
