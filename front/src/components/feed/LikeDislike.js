import axios from "axios";
import React, { useEffect, useState } from "react";
import iconLike from "../../assets/like.png";
import iconDislike from "../../assets/dislike.png";

let userId = sessionStorage.getItem("userId");
let token = sessionStorage.getItem("token");

let switchLike = 1;
let switchDislike = -1;

const LikeDislike = ({ post }) => {
  //State
  const [likes, setLikes] = useState(0);
  const [allLikers, setAllLikers] = useState([]);

  const [dislikes, setDislikes] = useState(0);
  const [allDislikers, setAllDislikers] = useState([]);

  //Comportement

  useEffect(() => {
    setLikes(post.like);
    setAllLikers(post.likers);

    setDislikes(post.dislike);
    setAllDislikers(post.dislikers);
  }, [post.dislike, post.like, post.dislikers, post.likers]);

  const handleLike = () => {
    if (allDislikers.includes(userId)) {
      alert(
        "Vous ne pouvez réagir qu'une fois par publication. Cliquez de nouveau pour supprimer votre réaction"
      );
    } else {
      if (allLikers.includes(userId)) {
        switchLike = 0;

        axios({
          method: "post",
          url: `http://localhost:3001/api/post/${post._id}/like`,
          headers: {
            authorization: token,
          },
          data: {
            posterId: userId,
            //Dans les deux cas, like ou dislike c'est la variable like que l'on met dans le body
            like: switchLike,
          },
        })
          .then((res) => {
            //gestion de l'ajout 1 ou de l'ajout de 0
            setLikes(likes - 1);
            setAllLikers(
              allLikers.filter((likers) => {
                return likers !== userId;
              })
            );
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        switchLike = 1;

        axios({
          method: "post",
          url: `http://localhost:3001/api/post/${post._id}/like`,
          headers: {
            authorization: token,
          },
          data: {
            posterId: userId,
            //Dans les deux cas, like ou dislike c'est la variable like que l'on met dans le body
            like: switchLike,
          },
        })
          .then((res) => {
            //gestion de l'ajout 1 ou de l'ajout de 0 se gere ici
            setLikes(likes + switchLike);
            setAllLikers([...allLikers, userId]);
          })
          .catch((err) => {
            alert(err);
          });
      }
    }
  };

  const handleDislike = () => {
    if (allLikers.includes(userId)) {
      alert(
        "Vous ne pouvez réagir qu'une fois par publication. Cliquer de nouveau pour supprimer votre réaction "
      );
    } else {
      if (allDislikers.includes(userId)) {
        switchDislike = 0;

        axios({
          method: "post",
          url: `http://localhost:3001/api/post/${post._id}/like`,
          headers: {
            authorization: token,
          },
          data: {
            posterId: userId,
            like: switchDislike,
          },
        })
          .then((res) => {
            //gestion de l'ajout 1 ou de l'ajout de 0
            setDislikes(dislikes - 1);
            setAllDislikers(
              allDislikers.filter((dislikers) => {
                return dislikers !== userId;
              })
            );
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        switchDislike = -1;

        axios({
          method: "post",
          url: `http://localhost:3001/api/post/${post._id}/like`,
          headers: {
            authorization: token,
          },
          data: {
            posterId: userId,
            like: switchDislike,
          },
        })
          .then((res) => {
            //gestion de l'ajout 1 ou de l'ajout de 0
            setDislikes(dislikes + 1);
            setAllDislikers([...allDislikers, userId]);
          })
          .catch((err) => {
            alert(err);
          });
      }
    }
  };

  //Render
  return (
    <div>
      <div>
        <img
          src={iconLike}
          alt="Logo like"
          className={allLikers.includes(userId) ? "container__like--add" : ""}
          id="icone__like__dislike"
          onClick={handleLike}
        />
        {likes}
      </div>

      <div className="container__like">
        <img
          src={iconDislike}
          alt="Logo dislike"
          className={
            allDislikers.includes(userId) ? "container__like--add" : ""
          }
          id="icone__like__dislike"
          onClick={handleDislike}
        />
        {dislikes}
      </div>
    </div>
  );
};

export default LikeDislike;
