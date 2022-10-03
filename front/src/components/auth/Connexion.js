import React, { useState } from "react";
import CardSignUp from "./CardSignUp";
import CardSingIn from "./CardSingIn";
import "../../styles/main.scss";

const Connexion = () => {
  //State
  const [signUp, setsignUp] = useState(false);
  const [signIn, setsignIn] = useState(true);

  //Comportement
  const handleConnexion = (e) => {
    if (e.target.id === "signUp") {
      setsignIn(false);
      setsignUp(true);
    } else if (e.target.id === "signIn") {
      setsignUp(false);
      setsignIn(true);
    }
  };

  //Render
  return (
    <div>
      <header>
        <ul className="header">
          <li onClick={handleConnexion} id="signUp">
            Inscription
          </li>
          <li onClick={handleConnexion} id="signIn">
            Connexion
          </li>
        </ul>
      </header>
      {signUp && <CardSignUp />}
      {signIn && <CardSingIn />}
    </div>
  );
};

export default Connexion;
