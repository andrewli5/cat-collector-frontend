import { Box, Typography } from "@mui/material";
import JumpingCat from "../assets/gifs/jumping_cat.gif";

const IMAGE_SIZE = 200;

export function LoadingSearch() {
  return (
    <Box
      sx={{
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img src={JumpingCat} />
      <Typography variant="h4" sx={{ marginTop: "10px" }}>
        Loading...
      </Typography>
    </Box>
  );
}
