import { CircularProgress, Box, Typography } from "@mui/material";

export function LoadingSearch() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <CircularProgress color="white" />
    </Box>
  );
}
