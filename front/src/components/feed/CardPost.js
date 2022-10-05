import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import pen from "../../assets/pen.png";
import ModalComment from "./ModalComment";
import arrowDown from "../../assets/down.png";
import { Tooltip } from "@mui/material";
import Comment from "./Comment";
import "../../styles/main.scss";
import LikeDislike from "./LikeDislike";
import ModifyTextPost from "./ModifyTextPost";
// Ce composant va venir implementer tout ce que l'on veut afficher quand on veut afficher un post.
// Toute la data est passé en props donc il ne reste plus qu'a l'utiliser

const CardPost = ({ post, isAdmin }) => {
  //State
  const [showWhriteComment, setShowWhriteComment] = useState(false);
  const [pseudoUser, setPseudoUser] = useState([]);
  const [profilPictureUser, setProfilPictureUser] = useState();
  const [showAllComments, setShowAllComments] = useState(false);

  const [message, setMessage] = useState(post.message);

  // Ce State contient tous mes commentaires que je vais passer en props a mon composant Comment pour pouvoir les traiter dynamiquement
  const [newComment, setNewComment] = useState(post.comments);

  //Comportement
  let pseudoPoster = document.querySelectorAll(".card__post__header--pseudo");
  let userIdFromSessionStorage = sessionStorage.getItem("userId");

  let userIdFromPosterId = post.posterId;

  //Formatage de la date
  const UpdateDate = moment(post.createdAt).format("DD-MM-YYYY hh:mm");

  //Remove post
  const handleRemovePost = () => {
    const confirmRemove = window.confirm(
      "Etes-vous certain de vouloir supprimer cette publication ?"
    );
    if (confirmRemove) {
      axios({
        method: "delete",
        url: `http://localhost:3001/api/post/${post._id}`,
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
        data: {
          userId: userIdFromSessionStorage,
        },
      })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          alert("Cette publication ne vous appartient pas ");
        });
    }
  };

  // Affichage du pseudo dynamique
  useEffect(() => {
    axios(`http://localhost:3001/api/user/${userIdFromPosterId}`, {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
    }).then((res) => {
      setPseudoUser(res.data.pseudo);
      setProfilPictureUser(res.data.picture);
    });
  }, [userIdFromPosterId]);

  //Comment
  const handleShowComments = () => {
    setShowWhriteComment(!showWhriteComment);
  };

  //Render
  return (
    <div>
      <ul className="card__post">
        <div className="card__post__header">
          {profilPictureUser == null || profilPictureUser === "undefined" ? (
            <p></p>
          ) : (
            <li>
              <img
                src={profilPictureUser}
                alt="Illustration du profil"
                className="card__post__header--profilPicture"
              />
            </li>
          )}

          <li className="card__post__header--pseudo">
            {(pseudoPoster.textContent = `${pseudoUser}`)}
          </li>

          <div className="likeDislike">
            <li className="card__post__header--like">
              <LikeDislike post={post} />
            </li>
          </div>

          <li className="card__post__header--date">{UpdateDate}</li>
        </div>
        <hr />

        <div className="card__post__content">
          <li className="card__post__content--message">{message}</li>

          <li>
            <ModifyTextPost
              postMessage={post.message}
              posterId={post.posterId}
              postId={post._id}
              message={message}
              setMessage={setMessage}
              isAdmin={isAdmin}
              postPicture={post.picture}
            />
          </li>

          <li className="card__post__content--media">
            {post.picture === "" ? (
              ""
            ) : (
              <img
                src={post.picture}
                alt="Publication"
                className="card__post__content--media--image"
              />
            )}
          </li>

          <li className="card__post__content--comment">
            {newComment.length === 0 && (
              <span className="call__to__action__comments">
                Soyez le premier à réagir !
              </span>
            )}

            <Tooltip
              title="Rédiger un commentaire"
              placement="bottom"
              enterDelay={1500}
              leaveDelay={200}
            >
              <img
                src={pen}
                alt="Logo commentaire"
                className="logoPointer--writeComment "
                onClick={handleShowComments}
              />
            </Tooltip>

            {showWhriteComment && (
              <div>
                <div
                  className="container__comments"
                  onClick={() => {
                    setShowAllComments(false);
                  }}
                >
                  <ModalComment
                    post={post}
                    action={handleShowComments}
                    pseudoPoster={pseudoUser}
                    newComment={newComment}
                    setNewComment={setNewComment}
                  />
                </div>
              </div>
            )}
          </li>

          <li>
            {/* Si l'id du user et identique a l'id du posterId alors on affiche le bouton */}
            {userIdFromSessionStorage === userIdFromPosterId || isAdmin ? (
              <button
                type="Submit"
                onClick={handleRemovePost}
                className="card__post__content--remove"
              >
                Supprimer
              </button>
            ) : null}
          </li>

          <li>
            <Tooltip
              title="Afficher tous les commentaires"
              placement="top"
              enterDelay={1000}
              leaveDelay={200}
            >
              <img
                src={arrowDown}
                alt="Espace des autres commentaire"
                className="show__other__comments"
                onClick={() => {
                  setShowAllComments(!showAllComments);
                }}
              />
            </Tooltip>
            {/* Nombre de commentaire */}
            <span>{post.comments.length}</span>
          </li>
          <ul className="container__comments">
            {showAllComments &&
              newComment.map((comment) => {
                return (
                  <Comment
                    key={comment._id}
                    post={post}
                    showAllComments={showAllComments}
                    commentText={comment.text}
                    commenterPseudo={comment.commenterPseudo}
                    commenterId={comment.commenterId}
                    commentId={comment._id}
                    postComment={comment}
                    isAdmin={isAdmin}
                  />
                );
              })}
          </ul>
        </div>
      </ul>
    </div>
  );
};

export default CardPost;
