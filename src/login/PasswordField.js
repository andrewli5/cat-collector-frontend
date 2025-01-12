import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField } from "@mui/material";

export function PasswordField({ register }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      required
      fullWidth
      name="password"
      label="password"
      type={showPassword ? "text" : "password"}
      id="password"
      autoComplete={register ? "new-password" : "current-password"}
      InputProps={{
        endAdornment: showPassword ? (
          <VisibilityOff
            onClick={handleClickShowPassword}
            sx={{ cursor: "pointer" }}
          />
        ) : (
          <Visibility
            onClick={handleClickShowPassword}
            sx={{ cursor: "pointer" }}
          />
        ),
      }}
    />
  );
}
