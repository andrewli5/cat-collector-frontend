import React from "react";

export const CoinDiffLabel = ({ coinDiff }) => {
  return (
    <>
      {coinDiff != 0 && (
        <>
          {coinDiff > 0 ? "+" : "-"}
          {Math.abs(coinDiff).toLocaleString()}
        </>
      )}
    </>
  );
};
