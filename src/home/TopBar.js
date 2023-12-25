import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Button,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  useMediaQuery,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { APP_NAME } from "../constants";
import { clearBrowserStorage, getCurrentUser } from "../client";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import * as client from "../client";
import Link from "@mui/material/Link";
import { useState } from "react";
import SadCat from "../assets/crying_cat_icon.png";
import Logo from "../assets/main_icon.png";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@emotion/react";
import { importAll } from "../utils/importAll";

export default function TopBar() {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [drawer, setDrawer] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const profileIcons = importAll(
    require.context("../assets/profileIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const catIcons = importAll(
    require.context("../assets/catIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const mythicCatIcons = importAll(
    require.context("../assets/mythicCatIcons", false, /\.(png|jpe?g|svg)$/)
  );
  const allCatIcons = Object.assign(catIcons, mythicCatIcons);

  const availableIcons = Object.assign(profileIcons, allCatIcons);

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

  const LogoutDialog = () => {
    return (
      <Dialog
        onClose={() => setIsLogoutDialogOpen(false)}
        open={isLogoutDialogOpen}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" variant="h3">
          {"Log out?"}
        </DialogTitle>
        <Box textAlign={"center"}>
          <img src={SadCat} alt="sad cat" style={{ width: 40, height: 40 }} />
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
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
    );
  };

  return (
    <Box bgcolor="primary.main" sx={{ width: "100%", alignItems: "center" }}>
      <Toolbar>
        <a href="/">
          <img
            src={Logo}
            alt="logo"
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              marginBottom: -6,
            }}
          />
        </a>
        {isMdScreen && (
          <Typography variant="h3" noWrap>
            <Link
              noWrap
              style={{ color: "white", textDecoration: "none" }}
              href="/"
              marginRight={3}
            >
              {APP_NAME + "."}
            </Link>
          </Typography>
        )}
        <Box
          sx={{
            height: 80,
            alignItems: "center",
            display: "flex",
          }}
        >
          <Box
            component="form"
            action="search"
            onSubmit={handleSearch}
            noValidate
          >
            <TextField
              size="small"
              id="search"
              label="search cats..."
              variant="outlined"
              color="white"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="white" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <LogoutDialog />
        <Box marginLeft="auto">
          <Grid container alignItems="center" wrap="nowrap">
            {!getCurrentUser() ? (
              <>
                <Grid item>
                  <Button href="/signin" color="white" sx={{ minWidth: 95 }}>
                    sign in
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    href="/signup"
                    color="tertiary"
                    variant="contained"
                    sx={{ minWidth: 95 }}
                  >
                    sign up
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <IconButton
                    onClick={() => setDrawer(true)}
                    color="white"
                    sx={{
                      bgcolor: "tertiary.main",
                      "&:hover": {
                        bgcolor: "tertiary.main",
                      },
                      marginLeft: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={availableIcons[getCurrentUser().icon]}
                    />
                  </IconButton>
                </Grid>
                <SwipeableDrawer
                  anchor="right"
                  open={drawer}
                  onClose={() => setDrawer(false)}
                  onOpen={() => setDrawer(true)}
                >
                  <Box
                    sx={{
                      width: 250,
                      height: "100%",
                      bgcolor: "primary.main",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <Typography variant="h5" color="white">
                      logged in as: {getCurrentUser().username}
                    </Typography>
                    <Button
                      href="/myprofile"
                      variant="outlined"
                      color="white"
                      fullWidth
                      onClick={() => setIsLogoutDialogOpen(true)}
                      sx={{ marginTop: 2 }}
                    >
                      my profile
                    </Button>
                    <Button
                      color="white"
                      onClick={() => setIsLogoutDialogOpen(true)}
                      sx={{ marginTop: 2 }}
                    >
                      log out
                    </Button>
                  </Box>
                </SwipeableDrawer>
              </>
            )}
          </Grid>
        </Box>
      </Toolbar>
    </Box>
  );
}
