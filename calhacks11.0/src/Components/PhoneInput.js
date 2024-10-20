import React from "react";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
const PhoneInput = ({
  phoneNumber,
  textMask,
  handleChange,
  handleSubmit,
  usernumber,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="flex flex-col items-center"
      >
        <FormControl variant="standard">
          <label htmlFor="formatted-text-mask-input" className="text-center">
            Phone Number
          </label>
          <Input
            value={phoneNumber || usernumber}
            name="textmask"
            id="formatted-text-mask-input"
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <div className="mt-3">
        <Button variant="contained" type="submit" onClick={handleSubmit}>
          Get a call
        </Button>
      </div>
    </div>
  );
};

export default PhoneInput;
