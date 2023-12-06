import { Typography, Button } from "@mui/material"; 
export default function Forbidden() {
    return (
      <div style={{textAlign: "center"}}>
        <Typography variant="h4" color="grey" textAlign="center" sx={{marginBottom: 2}}>
          access forbidden
        </Typography>
        <Button variant="contained" color="secondary" href="/">
          {"back to home"}
        </Button>
      </div>
    );
}
