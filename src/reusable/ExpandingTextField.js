import { TextField, styled } from "@mui/material";

const ExpandingTextField = styled(
  TextField,
  {}
)(() => ({
  "& .MuiOutlinedInput-root": {
    border: ".8px solid white",
    width: "40%",
    transition: "width ease-in-out 0.25s",
    minWidth: "200px",
    "&.Mui-focused": {
      width: "90%",
    },
    "& label.Mui-focused": {
      color: "white",
    },
  },
}));

export default ExpandingTextField;
