import React from "react";
import { Link } from "react-router-dom";
import home from "../../assets/home.png";
import createPost from "../../assets/drawing.png";
import user from "../../assets/user.png";
import deconnexion from "../../assets/close.png";
import Popup from "reactjs-popup";
import Tooltip from "@mui/material/Tooltip";
import "../../styles/main.scss";

const NavBar = () => {
  //State

  //Comportement

  //Render
  return (
    <div>
      <ul className="navBar">
        <li>
          <Link to="/feed">
            <Tooltip
              title="Fil d'actualité"
              placement="bottom"
              enterDelay={1000}
              leaveDelay={300}
            >
              <img src={home} alt="Bouton d'acceuil" className="navBar__img" />
            </Tooltip>
          </Link>
        </li>

        <li>
          <Link
            to="/postWriting"
            className="navBar__explanation--whithOutUnderline"
          >
            <Tooltip
              title="Nouvelle publication"
              placement="bottom"
              enterDelay={1000}
              leaveDelay={300}
            >
              <img
                src={createPost}
                alt="Bouton pour écrire un post"
                className="navBar__img"
              />
            </Tooltip>
            <span className="paragraph__explanation__iconNavbar">
              Nouvelle publication
            </span>
          </Link>
        </li>

        <li>
          <Link to="/user" className="navBar__explanation--whithOutUnderline">
            <Tooltip
              title="Profil"
              placement="bottom"
              enterDelay={1000}
              leaveDelay={300}
            >
              <img
                src={user}
                alt="Bouton pour afficher son profil"
                className="navBar__img"
              />
            </Tooltip>
            <span className="paragraph__explanation__iconNavbar">Profil</span>
          </Link>
        </li>
        <Tooltip
          title="Déconnexion"
          placement="bottom"
          enterDelay={1000}
          leaveDelay={300}
        >
          <li>
            <Popup
              trigger={
                <img
                  src={deconnexion}
                  alt="Bouton de déconnexion"
                  className="navBar__img"
                />
              }
              modal
              nested
            >
              {(close) => (
                <div className="modal">
                  <button
                    onClick={() => {
                      sessionStorage.clear();
                      window.location = "/";
                    }}
                    id="button__logout"
                  >
                    Je me deconnecte
                  </button>

                  <button
                    onClick={() => {
                      close();
                    }}
                    id="button__stayConnect"
                  >
                    Je reste
                  </button>
                </div>
              )}
            </Popup>
          </li>
        </Tooltip>
      </ul>
    </div>
  );
};

export default NavBar;
