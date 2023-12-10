import {
  Grid,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { APP_NAME } from "../constants";
import { getCurrentUser } from "../client";
import { useNavigate } from "react-router-dom";
import * as client from "../client";
import EditIcon from "@mui/icons-material/Edit";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import EditableText from "../reusable/EditableText";
import { LoadingButton } from "@mui/lab";
import SearchIcon from "@mui/icons-material/Search";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [queriedUsers, setQueriedUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const newQueriedUsers = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.firstName.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.role.toLowerCase().includes(query.toLowerCase().trim()) ||
        user.coins.toString().toLowerCase().includes(query.toLowerCase().trim())
      );
    });
    setQueriedUsers(newQueriedUsers);
  }, [query]);

  useEffect(() => {
    document.title = "admin tools | " + APP_NAME;
    if (!getCurrentUser()) {
      navigate("/signin");
    } else if (getCurrentUser().role !== "ADMIN") {
      navigate("/forbidden");
    } else {
      setLoading(true);
      fetchAllUsers();
    }
  }, []);

  const handleFieldEdited = (field, value) => {
    if (field === "coins") {
      value = parseInt(value);
    }

    setUserBeingEdited({ ...userBeingEdited, [field]: value });
  };

  const handleSave = async () => {
    // user shouldn't be able to edit their own role
    if (
      getCurrentUser()._id === userBeingEdited._id &&
      getCurrentUser().role !== userBeingEdited.role
    ) {
      setError(true);
      setErrorMessage("cannot edit your own role.");
      return;
    }

    try {
      setLoading(true);
      const _ = await client.updateUserByUserId(userBeingEdited._id, {
        ...userBeingEdited,
      });
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response) {
        setError(true);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const handleCancel = () => {
    setUserBeingEdited({});
  };

  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await client.getAllUsers();
      setUsers([...fetchedUsers]);
      setQueriedUsers([...fetchedUsers]);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
      setErrorMessage("error fetching users.");
    }
  };

  if (!getCurrentUser()) {
    return null;
  }

  return (
    <>
      <NotificationSnackbar
        open={success}
        setOpen={setSuccess}
        severity="success"
        message="successfully saved! reloading..."
        autoHideDuration={3000}
      />
      <NotificationSnackbar
        open={error}
        setOpen={setError}
        severity="error"
        message={errorMessage.toLowerCase()}
        autoHideDuration={3000}
      />
      <Typography
        variant="h3"
        color="white"
        textAlign="center"
        marginBottom={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        {"admin tools"}
        <TextField
          size="small"
          label="search by any field..."
          fullWidth
          sx={{ maxWidth: "300px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="quintenary" />
              </InputAdornment>
            ),
          }}
        />
      </Typography>
      <Grid
        container
        rowSpacing={3}
        alignItems="center"
        justifyContent="center"
      >
        <UserRowHeaders />
        <Grid item xs={12}>
          <Divider flexItem />
        </Grid>
        {queriedUsers.map((user) => (
          <EditableUserRow
            loading={loading}
            edit={user._id === userBeingEdited._id}
            key={user._id}
            user={user}
            userBeingEdited={userBeingEdited}
            setUserBeingEdited={setUserBeingEdited}
            handleFieldEdited={handleFieldEdited}
            handleSave={() => handleSave(user._id)}
            handleCancel={handleCancel}
            emphasized={user._id === getCurrentUser()._id}
          />
        ))}
      </Grid>
    </>
  );
}

function EditableUserRow({
  edit,
  loading,
  user,
  userBeingEdited,
  setUserBeingEdited,
  handleFieldEdited,
  handleSave,
  handleCancel,
  emphasized,
}) {
  return (
    <Grid container columnSpacing={3} item key={user._id} xs={12}>
      <Grid item xs={2}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="username"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.username
              : user.username
          }
          onChange={(event) => {
            handleFieldEdited("username", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={2.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="first name"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.firstName
              : user.firstName
          }
          onChange={(event) => {
            handleFieldEdited("firstName", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={2.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          fullWidth
          small
          label="last name"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.lastName
              : user.lastName
          }
          onChange={(event) => {
            handleFieldEdited("lastName", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          small
          select
          fullWidth
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.role
              : user.role.toLowerCase()
          }
          label="role"
          menuItems={[
            { value: "ADMIN", text: "admin" },
            { value: "USER", text: "user" },
          ]}
          onChange={(event) => {
            handleFieldEdited("role", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={1.5}>
        <EditableText
          edit={edit}
          emphasized={emphasized}
          small
          fullWidth
          label="coins"
          value={
            user._id === userBeingEdited._id
              ? userBeingEdited.coins
              : user.coins
          }
          onChange={(event) => {
            handleFieldEdited("coins", event.target.value);
          }}
          type="number"
        />
      </Grid>
      <Grid item xs={2}>
        {!userBeingEdited._id || userBeingEdited._id !== user._id ? (
          <IconButton
            color="quintenary"
            onClick={() => {
              setUserBeingEdited({ ...user });
            }}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <Box display="flex" flexDirection="row">
            <LoadingButton
              loading={loading}
              color="primary"
              variant="contained"
              onClick={handleSave}
              sx={{ marginRight: 2 }}
            >
              save
            </LoadingButton>
            <Button
              color="quintenary"
              variant="contained"
              onClick={handleCancel}
            >
              cancel
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

function UserRowHeaders() {
  return (
    <>
      <Grid
        container
        columnSpacing={3}
        item
        xs={12}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={2}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            username
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            first name
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            last name
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            role
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            coins
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            actions
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
