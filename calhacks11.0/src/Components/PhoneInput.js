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
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl variant="standard">
        <label htmlFor="formatted-text-mask-input">Phone Number</label>
        <Input
          value={phoneNumber || usernumber}
          name="textmask"
          id="formatted-text-mask-input"
          onChange={handleChange}
        />
      </FormControl>
      <Button type="submit" onClick={handleSubmit}>
        Get a call
      </Button>
    </Box>
  );
};

export default PhoneInput;
