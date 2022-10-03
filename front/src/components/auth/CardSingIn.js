import React from "react";
import { useState } from "react";
import axios from "axios";
import "../../styles/main.scss";

const CardSingIn = () => {
  //State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let errorMessage = document.querySelector(".errorMessage");

  //Comportement
  const handleSignIn = (e) => {
    e.preventDefault();
    //Reset error message value
    errorMessage.textContent = "";

    axios({
      method: "post",
      url: "http://localhost:3001/api/user/login",

      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.userId);
        window.location = "/feed";
      })
      .catch((err) => {
        //ID/ Password Error
        console.log(err);
        if (err.message.includes("401")) {
          errorMessage.textContent = "Adresse email ou mot de passe incorrect";
        } else if (err.message.includes("500")) {
          errorMessage.textContent = "Adresse email ou mot de passe incorrect";
        }
      });
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  //Render
  return (
    <div className="card">
      <h1 className="card__title">Connexion</h1>

      <form action="" onSubmit={handleSignIn} className="form__connexion">
        <label htmlFor="Email"></label>
        <input
          type="email"
          name="Email"
          id="Email"
          onChange={handleEmail}
          placeholder="Email"
          required
          className="input__auth"
        />

        <label htmlFor="password"></label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePassword}
          placeholder="Mot de passe"
          required
          className="input__auth"
        />

        <input type="submit" value="Ok" className="input__auth form--button" />

        <div className="errorMessage"></div>
      </form>
    </div>
  );
};

export default CardSingIn;
