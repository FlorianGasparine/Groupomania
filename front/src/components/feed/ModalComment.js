import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import "../../styles/main.scss";

let userId = sessionStorage.getItem("userId");
let userConnected;

const ModalComment = ({ action, post, newComment, setNewComment }) => {
  //State

  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  //Comportement
  useEffect(() => {
    axios(`http://localhost:3001/api/user/${userId}`, {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
    }).then((res) => {
      userConnected = res.data.pseudo;
    });
  }, []);

  const handleSubmitComment = (e) => {
    e.preventDefault();

    axios({
      method: "patch",
      url: `http://localhost:3001/api/post/comment-post/${post._id}`,
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
      data: {
        commenterId: userId,
        commenterPseudo: userConnected,
        text: newComment,
      },
    }).then((res) => {
      setShowConfirmMessage(!showConfirmMessage);
      setNewComment(res.data.comments);
      setInterval(() => window.location.reload(), 1000);
    });
  };

  //Render
  return (
    <div className="container__modal__comments">
      <div className="container__modal__comments--modal">
        <h1 className="post__tittle">Commentaire</h1>

        <div>
          <form
            action=""
            onSubmit={handleSubmitComment}
            className="post__add__comments"
          >
            <label htmlFor="newComment"></label>
            <textarea
              name="newComment"
              id="newComment"
              className="post__add__comments--newComment"
              cols="20"
              rows="9"
              placeholder="Ajouter un commentaire..."
              maxLength="500"
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>

            <button type="submit" className="post__add__comments--button">
              Ajouter
            </button>
          </form>
        </div>
        {showConfirmMessage && (
          <Alert variant="filled" severity="success">
            Commentaire ajouté avec succés !
          </Alert>
        )}

        <div
          className="container__modal__comments--close"
          onClick={() => {
            action();
          }}
        ></div>
      </div>
    </div>
  );
};

export default ModalComment;
