import { MenuItem, TextField, Typography } from "@mui/material";

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
    <Typography
      variant="h5"
      sx={
        emphasized
          ? { fontWeight: "bold", color: "yellow" }
          : { fontWeight: "normal", color: "white" }
      }
    >
      {type === "number" ? value.toLocaleString() : value}
    </Typography>
  );
}
