import { Alert, Snackbar } from "@mui/material";

export default function NotificationSnackbar({
  open,
  setOpen,
  severity,
  message,
  autoHideDuration,
  icon,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        icon={icon === false || null}
        sx={{ fontSize: 22, alignItems: "center" }}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
