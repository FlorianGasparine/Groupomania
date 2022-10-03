import axios from "axios";
import React, { useState } from "react";
import NavBar from "../components/feed/NavBar";
import Alert from "@mui/material/Alert";
import "../styles/main.scss";
import { Tooltip } from "@mui/material";

const PostWriting = () => {
  //State
  const [messageContent, setMessageContent] = useState("");
  const [imageContent, setImageContent] = useState("");
  const [alertSucces, setAlertSucess] = useState(false);
  const [alertError, setAlertError] = useState(false);

  //Comportement
  function addingTimeToRedirect() {
    window.location = "/feed";
  }

  const handleSubmitNewPost = (e) => {
    e.preventDefault();
    let userId = sessionStorage.getItem("userId");
    let token = sessionStorage.getItem("token");

    if (imageContent === "" && messageContent === "") {
      alert("Veuillez renseigner soit un message, soit une image ");
    } else {
      axios({
        method: "post",
        url: "http://localhost:3001/api/post",
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data",
        },
        data: {
          posterId: userId,
          message: messageContent,
          picture: imageContent,
        },
      })
        .then((res) => {
          setAlertSucess(!alertSucces);
          setTimeout(() => addingTimeToRedirect(), 1500);
        })
        .catch((err) => {
          setAlertError(!alertError);
        });
    }
  };

  //Render
  return (
    <div>
      <NavBar />
      <form
        action=""
        onSubmit={handleSubmitNewPost}
        className="form__postWriting"
      >
        <h1 className="form__postWriting__title">Créer une publication</h1>

        <label htmlFor="text" className="form__postWriting__message"></label>
        <textarea
          placeholder="Rédiger un nouveau post"
          maxLength="240"
          type="text"
          name="message"
          id="message"
          cols="25"
          rows="10"
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
        ></textarea>

        <label htmlFor="image" className="form__postWriting__image"></label>
        <Tooltip title="Formats acceptés : {jpg, jpeg, png}" placement="top">
          <input
            type="file"
            name="picture"
            id="image"
            onChange={(e) => {
              setImageContent(e.target.files[0]);
            }}
          />
        </Tooltip>

        <button type="submit" className="form__postWriting__button">
          Publier !
        </button>

        <div className="container__alert__message">
          {alertSucces && (
            <Alert variant="filled" severity="success">
              Publication posté avec succés !
            </Alert>
          )}
          {alertError && (
            <Alert variant="filled" severity="error">
              Message ou image, il faut choisir
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostWriting;
