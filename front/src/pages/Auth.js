import React from "react";
import "../styles/main.scss";
import logo from "../assets/groupomania_Logos/logo-groupomania.png";
import Connexion from "../components/auth/Connexion";

const Auth = () => {
  //State

  //Comportement

  //Render
  return (
    <div>
      <Connexion />

      <footer>
        <img className="logo" src={logo} alt="Logo Groupomania" />
      </footer>
    </div>
  );
};

export default Auth;
