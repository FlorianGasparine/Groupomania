import React from "react";
import "../../styles/main.scss";
import { useState } from "react";
import axios from "axios";

const CardSignUp = () => {
  //State
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Comportement
  let pseudoError = document.querySelector(".errorPseudo");
  let emailError = document.querySelector(".errorEmail");
  let passwordError = document.querySelector(".errorPassword");

  let confirmationMessage = document.querySelector(".confirmation__message");

  let emailRegex = new RegExp(
    /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{1,10})+$/
  );

  const handleSignUp = (e) => {
    e.preventDefault();
    pseudoError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmationMessage.textContent = "";

    if (password.length < 12) {
      passwordError.textContent = "Merci de saisir plus de 12 caractères";
    } else {
      axios({
        method: "post",
        url: "http://localhost:3001/api/user/signup",
        data: {
          pseudo: pseudo,
          email: email,
          password: password,
        },
      })
        .then((res) => {
          confirmationMessage.textContent =
            "Félicitation, vous pouvez désormais vous connecter 😎";
        })
        .catch((err) => {
          //Verification Pseudo
          if (pseudo.length < 4) {
            pseudoError.textContent = "Veuillez saisir plus de 3 caractères";
          } else if (pseudo.length > 30) {
            pseudoError.textContent = "Veuillez saisir moins de 30 caractères";
          } else if (err.response.data.message.errors.pseudo) {
            pseudoError.textContent = " Pseudo déjà pris ou erroné";
          }

          //Verification Email
          if (emailRegex.test(email) === false) {
            emailError.textContent = "Merci de saisir une adresse email valide";
          } else if (err.response.data.message.errors.email) {
            emailError.textContent = "Email deja pris ou erroné";
          }
        });
    }
  };

  //Render
  return (
    <div className="card">
      <h1 className="card__title">Inscription</h1>

      <form action="" onSubmit={handleSignUp} className="form__connexion">
        <label htmlFor="pseudo"></label>
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          required
          className="input__auth form__connexion__input--margin"
        />
        <div className="errorPseudo"></div>

        <label htmlFor="email"></label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="form__connexion__input--margin input__auth"
        />
        <div className="errorEmail"></div>

        <label htmlFor="password"></label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          className="form__connexion__input--margin input__auth"
        />
        <div className="errorPassword"></div>

        <input
          type="submit"
          value="Ok"
          className="form--button form--button__signUp input__auth"
        />
      </form>

      <div className="confirmation__message"></div>
    </div>
  );
};

export default CardSignUp;
