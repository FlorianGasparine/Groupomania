import React, { useState, useEffect } from "react";
import CardPost from "../components/feed/CardPost";
import axios from "axios";
import "../styles/main.scss";
import NavBar from "../components/feed/NavBar";

const Feed = () => {
  //State
  const [posts, setPosts] = useState([]);
  const [pseudoUserConnected, setpseudoUserConnected] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  //Comportement
  let userConnect = sessionStorage.getItem("userId");

  useEffect(() => {
    axios("http://localhost:3001/api/post", {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
    }).then((res) => {
      setPosts(res.data);
    });
  }, []);

  useEffect(() => {
    axios(`http://localhost:3001/api/user/${userConnect}`, {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
    }).then((res) => {
      setpseudoUserConnected(res.data.pseudo);
      setIsAdmin(res.data.admin);
    });
  });

  //Render
  return (
    <div>
      <div className="container__pseudo__user__connected">
        <h1 className="pseudoConnected">{pseudoUserConnected}</h1>
      </div>

      <NavBar />
      <div>
        <ul className="container__posts">
          {posts.map((post) => {
            return <CardPost post={post} key={post._id} isAdmin={isAdmin} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Feed;
