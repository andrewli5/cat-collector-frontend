import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../constants";
import * as client from "../client";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
        const user = await client.signIn({username: data.get("username"), password: data.get("password")});
        const cats = await client.getCatsByUsername(user.username);
        const userWithCats = {...user, cats: cats};
        client.storeCurrentUser(userWithCats);
        navigate("/");
    } catch (error) {
        // TODO: handle error with snackbar
        if (error.response) {
          console.log(error.response.data.message);
        } else {
          console.log(error.message);
        }
    }
  };

  useEffect(() => {
    document.title = "sign in | " + APP_NAME;
    if (client.getCurrentUser()) {
        navigate("/");
    }
  }, []);

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
          sign in to {APP_NAME}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            sign in
          </Button>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href="/signup" variant="h5">
              {"don't have an account? sign up"}
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
