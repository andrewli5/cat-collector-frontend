import React, { useState } from 'react';
import { Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const SearchUser = () => {
    const [username, setUsername] = useState('search users...'); // Set the initial value here
    const navigate = useNavigate();

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {}
            const userExists = await checkUserExists(username);
            if (userExists) {
                navigate(`/profile/${username}`);
            } else {
                console.log('User does not exist');
                // Handle user not found scenario
            }
        }
    };

    const checkUserExists = async (username) => {
        // Make an API call or perform a database query to check if the user exists
        // Return true if the user exists, false otherwise
    };


    return (
        <div style={{ height: '30px' }}>
            <TextField 
                size='small'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};
export default SearchUser;


