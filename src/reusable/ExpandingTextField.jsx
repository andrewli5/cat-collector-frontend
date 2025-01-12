import { TextField, styled } from "@mui/material";

const ExpandingTextField = styled(
  TextField,
  {},
)(() => ({
  "& .MuiOutlinedInput-root": {
    width: "5%",
    transition: "width ease-in-out 0.3s",
    minWidth: "200px",
    maxWidth: "400px",
    "&.Mui-focused": {
      width: "70%",
    },
  },
}));

export default ExpandingTextField;
