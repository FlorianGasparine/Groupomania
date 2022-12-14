import React, { useState } from "react";
import axios from "axios";
import "../../styles/main.scss";

let userId = sessionStorage.getItem("userId");

const ModifyTextPost = ({
  postMessage,
  posterId,
  postId,
  message,
  setMessage,
  isAdmin,
  postPicture,
}) => {
  //State
  const [showEdit, setShowEdit] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [newPicture, setNewPicture] = useState();

  //Comportement
  const handleModifyPostMessage = () => {
    setShowEdit(!showEdit);
  };

  const handleSubmitNewMessage = (e) => {
    e.preventDefault();

    if (newMessage === undefined || newMessage === "") {
      setNewMessage(postMessage);
    }
    if (newPicture === undefined || postPicture === "") {
      setNewPicture(postPicture);
    }
    axios({
      method: "put",
      url: `http://localhost:3001/api/post/${postId}`,
      headers: {
        authorization: sessionStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
      data: {
        posterId: posterId,
        message: newMessage,
        picture: newPicture,
      },
    })
      .then((res) => {
        setMessage(newMessage);
        setNewMessage(newMessage);
        setShowEdit(!showEdit);
        setNewPicture(newPicture);
        window.location.reload();
      })
      .catch((err) => {
        alert("Impossible de modifier ce commentaire ");
      });
  };

  //Render
  return (
    <div>
      {/* Afficher ou non la possibilit√© de modifier */}
      {userId === posterId || isAdmin === true ? (
        <button
          onClick={handleModifyPostMessage}
          className="form__modifyTextPost--button"
        >
          Modifier
        </button>
      ) : null}

      {/* Affichage conditionnel du form */}
      {(userId === posterId && showEdit) || (showEdit && isAdmin) ? (
        <form
          onSubmit={handleSubmitNewMessage}
          className="form__modifyTextPost "
        >
          <textarea
            autoFocus={true}
            name="comment"
            id="edit--messagePost"
            cols="50"
            rows="10"
            minLength="2"
            maxLength="240"
            defaultValue={message}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          ></textarea>

          <input
            type="file"
            name="picture"
            className="profil__form--profilPicture"
            onChange={(e) => setNewPicture(e.target.files[0])}
          />

          <input type="submit" className="form__modifyTextPost--buttonSubmit" />
        </form>
      ) : null}
    </div>
  );
};

export default ModifyTextPost;
