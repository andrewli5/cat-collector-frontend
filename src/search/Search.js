import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import {
    APP_NAME,
  CAT_API_KEY,
  CAT_API_URL_BREEDS,
  CAT_API_URL_IMAGES,
} from "../constants";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import EmptySearch from "./EmptySearch";

const TEST_CAT_1 = "Test cat 1";
const TEST_CAT_2 = "Cattest 2";
const TEST_CAT_3 = "3 cat test";

const TEST_MATCHES = [
  { name: TEST_CAT_1, id: 1 },
  { name: TEST_CAT_2, id: 2 },
  { name: TEST_CAT_3, id: 3 },
];

const TEST_URLS = [
  {
    url: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-08/220805-domestic-cat-mjf-1540-382ba2.jpg",
    name: TEST_CAT_1,
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYP55BSa-Dh55_qjvMei2v8uMPukL4skwNGre2nZQpj4T-pcsT",
    name: TEST_CAT_2,
  },
  {
    url: "https://www.catster.com/wp-content/uploads/2018/03/Calico-cat.jpg",
    name: TEST_CAT_3,
  },
];

export default function Search() {
  const [matches, setMatches] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const params = useParams();
  const query = params.query;

  const isMatch = (query, breed) => {
    return breed.toLowerCase().includes(query.toLowerCase());
  };

  async function getBreeds() {
    const response = await fetch(CAT_API_URL_BREEDS, {
      headers: {
        "x-api-key": CAT_API_KEY,
      },
    });
    const data = await response.json();
    setBreeds(data);
  }

  useEffect(() => {
    document.title = query + " | " + APP_NAME;

    async function getMatches() {
      const matches = [];
      for (const breed of breeds) {
        if (isMatch(query, breed["name"])) {
          matches.push({
            name: breed["name"],
            id: breed["id"],
          });
        }
      }
      setMatches(matches);
    }

    if (query.toLowerCase() === "test") {
      setMatches(TEST_MATCHES);
      setBreeds(TEST_MATCHES);
    } else {
      getMatches();
      getBreeds();
    }
  }, [query]);

  useEffect(() => {
    async function getMatchImageUrls() {
      var imageUrls = [];

      if (query.toLowerCase() === "test") {
        imageUrls = TEST_URLS;
      } else {
        await Promise.all(
          matches.map(async (match) => {
            const response = await fetch(CAT_API_URL_IMAGES + match["id"], {
              headers: {
                "x-api-key": CAT_API_KEY,
              },
            });
            const data = await response.json();
            imageUrls.push(
              data.length === 0 || data[0]["url"] === undefined
                ? {
                    url: "",
                    name: match["name"],
                  }
                : {
                    url: data[0]["url"],
                    name: match["name"],
                  }
            );
          })
        );
      }

      setImageUrls(imageUrls);
      return imageUrls;
    }

    getMatchImageUrls();
  }, [matches]);

  // Return text where the query is highlighted
  const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) {
      return <>{text}</>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              style={{
                fontWeight: "bold",
                backgroundColor: "yellow",
                color: "black",
              }}
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <>
      <Typography variant="h3" textAlign="center" sx={{ marginBottom: 5 }}>
        results for: {query}
      </Typography>
      {matches.length === 0 ? (
        <EmptySearch />
      ) : (
        <Grid container rowSpacing={5} columnSpacing={30}>
          {imageUrls.map((image, index) => (
            <Grid
              display="flex"
              flexDirection="column"
              alignItems="center"
              item
              xs={2}
              key={index}
              sx={{ marginBottom: 3 }}
            >
              <img
                src={image["url"]}
                width={"200px"}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  height: "200px",
                  borderRadius: "10px",
                  border: "2px solid white",
                }}
                alt={`image-${index}`}
              />
              <Typography variant="h5" textAlign="center" noWrap>
                <HighlightedText text={image["name"]} highlight={query} />
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}