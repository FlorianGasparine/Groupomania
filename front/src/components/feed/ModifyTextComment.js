import axios from "axios";
import React, { useState } from "react";
import "../../styles/main.scss";

let userId = sessionStorage.getItem("userId");

const ModifyTextComment = ({
  commenterId,
  commentId,
  post,
  setComment,
  comment,
  isAdmin,
}) => {
  //State
  const [editShowEditComment, setShowEditComment] = useState(false);

  //Ce state sert uniquement à la vérification de la saisie utilisateur dans l'input.
  // Toutes les informations passes par "comment" et "setComment" en props et sont définit dans le state du composant "Comment"
  const [newComment, setNewComment] = useState("");

  //Comportement
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    if (newComment === "") {
      alert("Merci de modifier votre commentaire");
    } else {
      axios({
        method: "patch",
        url: `http://localhost:3001/api/post/update-comment-post/${post._id}`,
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
        data: {
          commentId: commentId,
          commenterId: userId,
          text: comment,
        },
      })
        .then(() => {
          setComment(comment);
        })
        .catch(() => {
          alert("Impossible de modifier ce commentaire ");
        });
    }
  };

  //Render
  return (
    <div>
      {userId === commenterId || isAdmin === true ? (
        <button
          onClick={() => {
            setShowEditComment(!editShowEditComment);
          }}
          className="new__comment_submit--edit"
        >
          Modifier
        </button>
      ) : null}

      {(userId === commenterId && editShowEditComment) ||
      (editShowEditComment && isAdmin) ? (
        <form action="" onSubmit={handleSubmitEditForm}>
          <label htmlFor="comment"></label>
          <textarea
            autoFocus={true}
            name="comment"
            id="editComment"
            cols="50"
            rows="10"
            minLength="2"
            maxLength="240"
            defaultValue={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setNewComment(e.target.value);
            }}
          ></textarea>

          <input
            type="submit"
            className="new__comment_submit"
            onClick={() => {
              setTimeout(() => setShowEditComment(false), 1000);
            }}
          />
        </form>
      ) : null}
    </div>
  );
};

export default ModifyTextComment;
