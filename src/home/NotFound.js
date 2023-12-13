import { Box } from "@mui/material";
import notFound from "../assets/404_not_found.jpg";

export default function NotFound() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <h1>where are you?</h1>
      <img src={notFound} />
    </Box>
  );
}
