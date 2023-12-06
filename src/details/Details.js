import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { CAT_API_KEY, CAT_API_URL_BREEDS, CAT_API_URL_IMAGE, CAT_API_URL_IMAGES } from "../constants";
import { Grid } from "@mui/material";
import CatImg from "../assets/catIcons/aegean.png";

export default function Details() {
    const [breedData, setBreedData] = useState(''); 
    const [imageUrls, setImageUrls] = useState([]);
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        async function getBreedData() {
            const response = await fetch(CAT_API_URL_BREEDS, {
            headers: {
                "x-api-key": CAT_API_KEY,
            },
            });
            const data = await response.json();
            // get current breed's data using id
            const currentBreed = data.find((breed) => breed.id === id);
            setBreedData(currentBreed);
        }

        getBreedData();
    });

    useEffect(() => {
        async function getImageURLS() { 
            const response = await fetch(CAT_API_URL_IMAGE + id, {
                headers: {
                    "x-api-key": CAT_API_KEY,
                },
            });
            const data = await response.json();
            setImageUrls(data);
            console.log("Image urls: ", data)
        }
    }, [breedData])

    return (
        <div>
            <h1>Details</h1>

            <Grid container spacing={2} maxHeight='lg' maxWidth='lg'>
                <Grid style={{paddingLeft: '70px'}}item xs={4} sm={5} md={6}>
                    <img 
                        src={CatImg}
                        width={400}
                        height={400}
                        alt={`image-${1}`}/>
                </Grid>
                <Grid item xs={10} sm={8} md={6}>
                    <h1 style={{margin: '0px'}}> {breedData.name} </h1>
                    <h3 style={{margin: 0}}> Rarity: </h3>
                    <hr></hr>
                    <span style={{fontSize: "18px", fontWeight: "bold"}}> Origin: </span> 
                    <span style={{float: "right"}}> {breedData.origin}</span>
                    <br></br>
                    <span style={{fontSize: "18px", fontWeight: 'bold'}}> Temperatment: </span> 
                    <span style={{float: "right"}}> {breedData.temperament} </span>
                    <br></br>
                    <br></br>
                    {breedData.description}

                </Grid>
            </Grid>
            <div> {JSON.stringify(breedData)} </div>

        </div>
    )
}