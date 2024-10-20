import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel, FormGroup } from "@mui/material";

export default function SwitchLabels({ onModeChange }) {
  const [isMotivMode, setIsMotivMode] = useState(false);

  const handleChange = (event) => {
    setIsMotivMode(event.target.checked);
    onModeChange(event.target.checked);
  };

  return (
    <div className={`flex text-center items-center justify-center ${isMotivMode ? 'text-white' : 'text-black'}`}>
    <FormGroup >
      <FormControlLabel
       
        control={<Switch checked={isMotivMode} onChange={handleChange} />}
        label=""
      />
    </FormGroup>
    <h1>Extra Motivation Mode</h1>
    </div>
    
  );
}
