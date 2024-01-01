import {
  Box,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";

export default function EditableText({
  edit,
  label,
  type,
  value,
  onChange,
  select,
  menuItems,
  small,
  emphasized,
}) {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return edit ? (
    <TextField
      fullWidth
      size={small ? "small" : "medium"}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      select={select}
    >
      {menuItems &&
        menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
    </TextField>
  ) : (
    <Box component="div" sx={{ overflow: "visible", textOverflow: "ellipsis" }}>
      <Typography
        variant="h5"
        noWrap
        sx={{
          fontWeight: emphasized ? "bold" : "normal",
          fontSize: isMobileScreen ? "1rem" : "1.25rem",
          color: emphasized ? "yellow" : "white",
          textOverflow: "scroll",
        }}
      >
        {type === "number" ? value.toLocaleString() : value}
      </Typography>
    </Box>
  );
}
