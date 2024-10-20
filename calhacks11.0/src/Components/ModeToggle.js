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
    <FormGroup className="top-2 right-2">
      <FormControlLabel
        control={<Switch checked={isMotivMode} onChange={handleChange} />}
        label="Extra Motivation Mode"
      />
    </FormGroup>
  );
}
