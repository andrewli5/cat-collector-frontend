import { useParams } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import { Container, Typography } from "@mui/material";
import { CAT_API_KEY, CAT_API_URL_BREEDS, CAT_API_URL_IMAGES } from "../constants";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import EmptySearch from "./EmptySearch";

export default function Search() {
    const [matches, setMatches] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [imageUrls, setImageUrls] = useState([]); 
    const params = useParams();
    const query = params.query;

    const isMatch = (query, breed) => {
        return breed.toLowerCase().includes(query.toLowerCase())
    };

    async function getBreeds() {
        const response = await fetch(CAT_API_URL_BREEDS, {
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });
        const data = await response.json();
        setBreeds(data);
    }

    useEffect(() => {
        async function getMatches() {
            const matches = []
            for (const breed of breeds) {
                if (isMatch(query, breed['name'])) {
                    matches.push({
                        'name': breed['name'],
                        'id': breed['id']
                    });
                }
            }
            setMatches(matches);
        }

        getMatches();
        getBreeds();
    }, [query])

    useEffect(() => {
        async function getMatchImageUrls() {
            const imageUrls = []

            await Promise.all(matches.map(async (match) => {
                const response = await fetch(CAT_API_URL_IMAGES + match['id'], {
                    headers: {
                        'x-api-key': CAT_API_KEY
                    }
                });
                const data = await response.json();
                imageUrls.push(data.length === 0 || data[0]['url'] === undefined ? 
                {
                    'url': "",
                    'name': match['name']
                } : 
                {
                    'url': data[0]['url'],
                    'name': match['name']
                });
            }));
            setImageUrls(imageUrls);
            return imageUrls;
        }

        getMatchImageUrls();
    }, [matches])

    
    return (
      <>
        <Typography variant="h3" textAlign="center"> results for: {query}</Typography>
        {matches.length === 0 ? (
          <EmptySearch />
        ) : (
          <Grid>
            {imageUrls.map((image, index) => (
              <Grid item>
                <img
                  src={image["url"]}
                  width={"40%"}
                  height={"40%"}
                  alt={`image-${index}`}
                />
                <div style={{ fontSize: "1.8em" }}> {image["name"]}</div>
              </Grid>
            ))}
          </Grid>
        )}
      </>
    );
}