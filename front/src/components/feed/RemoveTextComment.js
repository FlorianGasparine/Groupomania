import React from "react";
import axios from "axios";
import "../../styles/main.scss";

let userId = sessionStorage.getItem("userId");

const RemoveTextComment = ({ post, postComment, commentId, isAdmin }) => {
  //State

  //Comportement

  const handleRemoveComment = (e) => {
    e.preventDefault();
    const confirmRemove = window.confirm(
      "Etes-vous certain de vouloir supprimer votre commentaire ?"
    );
    if (confirmRemove) {
      axios({
        method: "patch",
        url: `http://localhost:3001/api/post/delete-comment-post/${post._id}`,
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
        data: {
          commentId: commentId,
          commenterId: userId,
        },
      })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          alert("Impossible de supprimer ce commentaire ");
        });
    }
  };

  //Render
  return (
    <div>
      {postComment.commenterId === userId || isAdmin === true ? (
        <button
          className="show__other__comments--remove"
          onClick={handleRemoveComment}
        >
          Supprimer
        </button>
      ) : null}
    </div>
  );
};

export default RemoveTextComment;
