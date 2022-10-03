const router = require("express").Router();
const userController = require("../controllers/user.js");
const auth = require("../middlewares/auth");
const userManagement = require("../controllers/user.controller");
const multer = require("../middlewares/multer.config");

// Authentification
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Gestion utilisateur
router.get("/:id", auth, multer, userManagement.userProfil); // Affiche un user selon son ID
router.put("/:id", auth, multer, userManagement.updateUser); // Modifie un user => Pseudo/Photo de profil
router.delete("/:id", auth, userManagement.deleteUser); //Supprime le profil d'un user

module.exports = router;
