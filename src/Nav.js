import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, FormControl, Grid, InputBase } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { APP_NAME } from "./constants";

function Nav() {
  const SearchBar = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      fontSize: 16,
      width: "auto",
      padding: "10px 12px",
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),
      "&:focus": {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      },
    },
  }));

  return (
    <Toolbar>
      <Typography
        variant="h4"
        component="a"
        noWrap
      >
        {APP_NAME}
      </Typography>
      <Box
        sx={{
          marginLeft: 5,
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
        }}
      >
        <FormControl variant="outlined">
          <SearchBar id="search" placeholder="search..." />
        </FormControl>
      </Box>

      <Box>
        <Grid container spacing={1}>
          <Grid item>
            <Button href="/signin" color="white">
              sign in
            </Button>
          </Grid>
          <Grid item>
            <Button href="/signup" color="white" variant="outlined">
              sign up
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Toolbar>
  );
}
export default Nav;
