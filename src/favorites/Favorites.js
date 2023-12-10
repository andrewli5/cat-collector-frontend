import React from "react";
import MyCats from "../mycats/MyCats";

export default function Favorites() {
  return (
    <>
      <MyCats favorites={true} />
    </>
  );
}
