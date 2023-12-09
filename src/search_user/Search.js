import React, { useState } from 'react';
import { Typography } from "@mui/material";
import { useHistory } from 'react-router-dom';

const Search = () => {
    const [username, setUsername] = useState('');
    const history = useHistory();

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            history.push(`/profile/${username}`);
        }
    };

    return (
        <div>
            <Typography variant="body1">search users...</Typography>
            <textarea
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};

export default SearchUser;
