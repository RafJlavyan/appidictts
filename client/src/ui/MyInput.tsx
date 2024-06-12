import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

const MyInput: React.FC<TextFieldProps> = ({ ...props }) => {
  return (
    <TextField
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#1A76D3", // Border color when focused
          },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: "#1A76D3", // Outline text color when focused
        },
      }}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
};

export default MyInput;