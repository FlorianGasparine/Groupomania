const router = require("express").Router();
const postController = require("../controllers/post.controller");
const multer = require("../middlewares/multer.config");
const auth = require("../middlewares/auth");

router.get("/", auth, postController.readPost);
router.post("/", auth, multer, postController.createPost);
router.put("/:id", auth, multer, postController.updatePost); // ID du POST (non l'id user)
router.delete("/:id", auth, postController.deletePost);
router.post("/:id/like", auth, postController.likeOrDislike); // Le front doit envoyé =>  1  -1 ou 0

//************************************************************************************************************************************** */
// Commentaire dans les post.routes car géré dans la meme BDD (BDD dans BDD)
// Le patch permet de rajouter et de ne pas ecraser les autres commentaires
// ID du post
router.patch("/comment-post/:id", auth, postController.createCommentPost);

//URL = id du post / commentId : id du commentaire, text : texte saisie par l'utilisateur.
router.patch(
  "/update-comment-post/:id",
  auth,
  postController.updateCommentPost
);

//URL : id du post / commentId : id du commentaire
router.patch(
  "/delete-comment-post/:id",
  auth,
  postController.deleteCommentPost
);

module.exports = router;
