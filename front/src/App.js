import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostWriting from "./pages/PostWriting";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import ModalComment from "./components/feed/ModalComment";
import "./styles/main.scss";
import Profil from "./pages/Profil";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/" element={<Auth />} />
          <Route path="/postWriting" element={<PostWriting />} />
          <Route path="/comment" element={<ModalComment />} />
          <Route path="/user" element={<Profil />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
