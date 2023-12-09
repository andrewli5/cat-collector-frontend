import React, { useState } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../client";

const SearchUser = () => {
    const [username, setUsername] = useState("search users...");
    const navigate = useNavigate();
    const handleKeyPress = async (event) => {
        
        if (event.key === "Enter") {
            const userExists = await getUserByUsername(username);
            if (userExists === null) {
                setUsername("user does not exist :(");
            } else {
                navigate(`/profile/${username}`);
            }
        }
    };

    const handleFocus = () => {
        if ((username === "search users...") || (username === "user does not exist :(")) {
            setUsername("");
        }
    };

    return (
        <div style={{ height: "30px" }}>
            <TextField
                rows={1}
                size="small"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleFocus}
                type={"standard"}
                InputProps={{
                    style: {
                        fontSize: "22px",
                        border: "0px",
                        fontColor: "gray",
                    },
                }}
            />
        </div>
    );
};
export default SearchUser;
