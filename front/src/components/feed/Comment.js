import React, { useState } from "react";
import "../../styles/main.scss";
import ModifyTextComment from "./ModifyTextComment";
import RemoveTextComment from "./RemoveTextComment";

const Comment = ({
  showAllComments,
  commentText,
  commenterPseudo,
  commenterId,
  commentId,
  post,
  postComment,
  isAdmin,
}) => {
  //State
  const [comment, setComment] = useState(commentText); //C'est le state qu'on va chercher a update avec la valeur de l'input (modifié) du composant enfant

  //Comportement

  //Render
  return (
    <div className="show__other__comments--commentList">
      {showAllComments && (
        <ul className="show__other__comments--comment">
          <li className="show__other__comments--pseudo">{commenterPseudo}</li>
          <li className="show__other__comments--text">{comment}</li>

          <ModifyTextComment
            key={commentId}
            commenterId={commenterId}
            commentId={commentId}
            post={post}
            comment={comment}
            setComment={setComment}
            isAdmin={isAdmin}
          />
          <RemoveTextComment
            commentId={commentId}
            post={post}
            postComment={postComment}
            isAdmin={isAdmin}
          />
        </ul>
      )}
    </div>
  );
};

export default Comment;
