import React from "react";
import { FormControl, Input, Button, Box } from "@mui/material";

const PhoneInput = ({ phoneNumber, handleChange, handleSubmit }) => {
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl variant="standard">
        <label htmlFor="formatted-text-mask-input">Phone Number</label>
        <Input
          id="formatted-text-mask-input"
          value={phoneNumber}
          onChange={handleChange}
          name="textmask"
        />
      </FormControl>
      <Button type="submit" onClick={handleSubmit}>
        Get a call
      </Button>
    </Box>
  );
};

export default PhoneInput;
