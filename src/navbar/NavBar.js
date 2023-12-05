import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import { APP_NAME } from "../constants";
import { currentUser } from "../login/loginClient";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";


function NavBar() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      search: data.get("search")
    });
    // TODO: implement search
    navigate("/home");
  };

  return (
    <Toolbar>
      <Typography variant="h4" component="a" noWrap>
        {APP_NAME}
      </Typography>
      <Box
        sx={{
          marginLeft: 5,
          flexGrow: 4,
          height: 80,
          display: { xs: "none", md: "flex", alignItems: "center" },
        }}
      >
        <Box component="form" onSubmit={handleSearch} noValidate>
          <TextField
            size="small"
            id="search"
            label="search cats"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {currentUser ? (
        <Button href="/profile" color="white">
          {"hi, " + currentUser.username + "!"}
        </Button>
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

export default NavBar;
