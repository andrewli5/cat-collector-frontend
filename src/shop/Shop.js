import { Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { APP_NAME } from "../constants";

export default function Shop() {
  useEffect(() => {
    document.title = "shop | " + APP_NAME;
  }, []);

  return (
    <Box>
      <Grid maxHeight='md' maxWidth='lg' >
        <Grid item xs={12}>
          item 1
        </Grid> 
      </Grid>
    </Box>
  );
}
