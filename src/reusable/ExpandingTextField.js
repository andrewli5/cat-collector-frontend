import { TextField, styled } from "@mui/material";

const ExpandingTextField = styled(
  TextField,
  {}
)(() => ({
  "& .MuiOutlinedInput-root": {
    width: "40%",
    transition: "width ease-in-out 0.25s",
    minWidth: "200px",
    "&.Mui-focused": {
      width: "90%",
    },
  },
}));

export default ExpandingTextField;
