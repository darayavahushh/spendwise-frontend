import React, { useState } from "react";
import { Button } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import "./Voted.css";

const VotedButton: React.FC = () => {
  const [voted, setVoted] = useState(false);

  const handleClick = () => {
    setVoted(!voted);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      className={`voted-button ${voted ? "voted" : "not-voted"}`}
    >
      {voted ? <SentimentSatisfiedAltIcon /> : <SentimentDissatisfiedIcon />}
      {voted ? "VOTED" : "NOT VOTED"}
    </Button>
  );
};

export default VotedButton;
