import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Button,
  Grid,
  TextField,
  InputAdornment,
  styled,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { APP_NAME } from "../constants";
import { clearBrowserStorage, getCurrentUser } from "../client";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import * as client from "../client";
import Link from "@mui/material/Link";
import { useState } from "react";

export default function TopBar() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const SearchField = styled(
    TextField,
    {}
  )(() => ({
    "& .MuiOutlinedInput-root": {
      width: "40%",
      transition: "width ease-in-out 0.3s",
      minWidth: "200px",
      "&.Mui-focused": {
        width: "90%",
      },
    },
  }));

  const handleSearch = (event) => {
    const query = event.currentTarget.search.value;
    event.preventDefault();
    if (query.length === 0) {
      navigate("/search");
    } else {
      navigate(`/search/${query}`);
    }
  };

  const handleLogout = async () => {
    try {
      await client.signOut();
      clearBrowserStorage();
      setIsLogoutDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Toolbar>
      <Typography variant="h3" noWrap>
        <Link style={{ color: "white", textDecoration: "none" }} href="/">
          {APP_NAME}
        </Link>
      </Typography>
      <Box
        sx={{
          marginLeft: 5,
          flexGrow: 1,
          height: 80,
          display: { xs: "none", md: "flex", alignItems: "center" },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSearch}
          noValidate
          sx={{ width: "100%" }}
        >
          <SearchField
            size="small"
            id="search"
            label="search cats..."
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <Dialog
        onClose={() => setIsLogoutDialogOpen(false)}
        open={isLogoutDialogOpen}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" variant="h3">
          {"Log out?"}
        </DialogTitle>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Button color="white" onClick={() => setIsLogoutDialogOpen(false)}>
            <Typography variant="h4" textAlign="center">
              No
            </Typography>
          </Button>
          <Button color="error" onClick={handleLogout}>
            <Typography variant="h4" textAlign="center">
              Yes
            </Typography>
          </Button>
        </div>
      </Dialog>
      {getCurrentUser() ? (
        <Box>
          <Grid container spacing={1}>
            <Grid item>
              <Button href="/profile" color="white">
                {"hi, " + getCurrentUser().firstName + "!"}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="tertiary"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                log out
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box>
          <Grid container spacing={1}>
            <Grid item>
              <Button href="/signin" color="white">
                sign in
              </Button>
            </Grid>
            <Grid item>
              <Button href="/signup" variant="contained">
                sign up
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Toolbar>
  );
}