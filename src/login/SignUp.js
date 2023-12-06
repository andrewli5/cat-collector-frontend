import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../constants";
import * as client from "../client";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const user = await client.signUp({
        username: data.get("username"),
        password: data.get("password"),
        firstName: data.get("firstName"),
        lastName: data.get("password"),
        role: "USER", // TODO: implement signup for both USER and ADMIN
      });
      client.storeCurrentUser(user);
      navigate("/");
    } catch (error) {
      // TODO: handle error
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    document.title = "sign up | " + APP_NAME;
    if (client.getCurrentUser()) {
      navigate("/");
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOpenIcon color="primary" sx={{ marginBottom: 2, fontSize: 40 }} />
        <Typography variant="h3" textAlign="center">
          sign up for {APP_NAME}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="first name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="last name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              sign up
            </Button>
            <Link href="/signin" variant="h5">
              {"already have an account? sign in"}
            </Link>
            <Link href="/" variant="h5">
              {"back to home"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
