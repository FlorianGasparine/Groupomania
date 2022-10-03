import React, { useEffect, useState } from "react";
import "../styles/main.scss";
import NavBar from "../components/feed/NavBar";
import axios from "axios";
import { Tooltip } from "@mui/material";

let token = sessionStorage.getItem("token");
let userId = sessionStorage.getItem("userId");

const Profil = () => {
  //State
  const [olderPicture, setOlderPicture] = useState("");
  const [olderPseudoValue, setOlderPseudoValue] = useState("");
  const [pseudoValue, setPseudoValue] = useState("");
  const [pictureValue, setPictureValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Comportement
  const formData = new FormData();

  //Recuperation des données du userId
  useEffect(() => {
    axios(`http://localhost:3001/api/user/${userId}`, {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
    }).then((res) => {
      setOlderPicture(res.data.picture);
      setOlderPseudoValue(res.data.pseudo);
      setEmail(res.data.email);
      setPassword(res.data.password);
    });
  }, []);

  const handleVerificationInformationForSubmit = () => {
    if (pseudoValue === "") {
      setPseudoValue(olderPseudoValue);
    }
    if (pictureValue === "") {
      setPictureValue(olderPicture);
    }
  };

  const handleSubmitProfilForm = (e) => {
    e.preventDefault();

    formData.append("picture", pictureValue);
    formData.append("email", email);
    formData.append("pseudo", pseudoValue);
    formData.append("password", password);
    formData.append("_id", userId);

    axios({
      method: "put",
      url: `http://localhost:3001/api/user/${userId}`,
      headers: {
        authorization: token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    })
      .then((res) => {
        window.location = "/feed";
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  //Remove
  const handleRemoveProfil = (e) => {
    e.preventDefault();
    const confirmRemove = window.confirm(
      "Etes-vous certain de vouloir supprimer votre compte ?"
    );
    if (confirmRemove) {
      axios({
        method: "delete",
        url: `http://localhost:3001/api/user/${userId}`,
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data",
        },
        data: {
          _id: "6321fb7589375f86f61204a1",
        },
      })
        .then((res) => {
          alert("Votre compte a bien été supprimé");
          formData.delete("_id");
          formData.delete("picture");
          formData.delete("email");
          formData.delete("pseudo");
          formData.delete("password");
          window.location = "/";
        })
        .catch((err) => console.log(err));
    }
  };

  //Render
  return (
    <div>
      <NavBar />
      <form
        action=""
        className="profil__form "
        onSubmit={handleSubmitProfilForm}
      >
        <h1 className="profil__form--title">Profil</h1>

        <label htmlFor="image">Choisissez une photo de profil</label>
        <Tooltip title="Formats acceptés : {jpg, jpeg, png}" placement="bottom">
          <input
            type="file"
            name="picture"
            className="profil__form--profilPicture"
            onChange={(e) => setPictureValue(e.target.files[0])}
          />
        </Tooltip>
        <br />

        <label htmlFor="changePseudo">Pseudo</label>
        <br />
        <input
          type="text"
          name="changePseudo"
          className="profil__form--pseudo"
          defaultValue={olderPseudoValue}
          minLength="4"
          maxLength="30"
          onChange={(e) => setPseudoValue(e.target.value)}
          required
        ></input>
        <br />

        <label htmlFor="disableEmail">Email</label>
        <br />
        <input
          type="texte"
          disabled
          defaultValue={email}
          className="profil__form--email"
        ></input>

        <button
          onClick={handleRemoveProfil}
          className="profil__form--btnRemove"
        >
          Supprimer mon profil
        </button>

        <button
          type="submit"
          className="profil__form--btnSubmit"
          onClick={handleVerificationInformationForSubmit}
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default Profil;
