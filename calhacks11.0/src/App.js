import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import * as React from "react";

const PhoneTextMask = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
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
  const [values, setValues] = React.useState({
    phoneformat: "(100) 000-0000",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    // testing, please remove
  };

  const handleSubmit = () => {
    console.log(values.textmask);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-10 bg-slate-100">
      <h1 className="text-3xl text-center text-purple-600 font-bold pb-10">
        Treelungo
      </h1>
      <div className="w-max">
        <FormControl variant="standard" onSubmit={handleChange}>
          <InputLabel htmlFor="formatted-text-mask-input">
            enter phone number
          </InputLabel>
          <Input
            value={values.textmask}
            name="textmask"
            id="formatted-text-mask-input"
            inputComponent={PhoneTextMask}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit}>Get a call</Button>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
