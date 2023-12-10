import { Alert, Snackbar } from "@mui/material";

export default function NotificationSnackbar({
  open,
  setOpen,
  severity,
  message,
  autoHideDuration,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration || 5000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert sx={{ fontSize: 22, alignItems: "center" }} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
