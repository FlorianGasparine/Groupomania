const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs"); //méthode pour interagir avec le systeme de fichier du server
const { userInfo } = require("os");

module.exports.readPost = (req, res, next) => {
  PostModel.find()
    .sort({ createdAt: -1 }) // Permet de trier les post du plus récent au plus ancien
    .then((PostSchema) => res.status(200).json(PostSchema))
    .catch((error) => res.status(400).json({ error }));
};

module.exports.createPost = (req, res, next) => {
  let newPost;
  if (req.file == undefined) {
    newPost = new PostModel({
      picture: null,
      ...req.body,
    });
    newPost
      .save()
      .then((post) => res.status(201).json(post))
      .catch((error) => res.status(400).json({ error }));
  } else {
    newPost = new PostModel({
      picture: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      ...req.body,
    });

    newPost
      .save()
      .then((post) => res.status(201).json(post))
      .catch((error) => res.status(400).json({ error }));
  }
};

module.exports.updatePost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  PostModel.findOne({ _id: req.params.id })
    .then((post) => {
      UserModel.findById(req.body.posterId) // ID qui vient du SessionStorage Front
        .then((currentUser) => {
          if (post.posterId == req.body.posterId || currentUser.admin == true) {
            PostModel.updateOne(
              { _id: req.params.id },
              {
                picture: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`,
                ...req.body,
                _id: req.params.id,
              }
            )
              .then(() => {
                res.status(201).json({ message: "Le post a bien été modifié" });
              })
              .catch((error) =>
                res.status(400).json({
                  error:
                    "Vous n'êtes pas autorisé à modifier cette publication",
                })
              );
          }
        });
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

module.exports.deletePost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  PostModel.findOne({ _id: req.params.id })
    .then((post) => {
      UserModel.findById(req.body.userId) //Ce userId qui vient du SessionStorage Front
        .then((currentUser) => {
          if (post.posterId == req.body.userId || currentUser.admin == true) {
            // Cherche l'objet dans la BDD
            const filename = post.picture.split("/images/")[1];
            // Supprime le fichier
            fs.unlink(`images/${filename}`, () => {
              // Supprimer l'objet dans la BDD
              PostModel.deleteOne({ _id: req.params.id })
                .then(() =>
                  res
                    .status(200)
                    .json({ message: "La publication a bien été supprimé" })
                )
                .catch((error) => res.status(401).json({ error }));
            });
          } else {
            res.status(403).json({
              message: "Vous n'êtes pas autorisé à supprimer cette publication",
            });
          }
        })
        .catch((error) =>
          res.status(500).json({ error: error + "vous n'etes pas autorisé" })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

module.exports.likeOrDislike = (req, res, next) => {
  let like = req.body.like;
  let posterId = req.body.posterId;
  let postId = req.params.id;

  switch (like) {
    //Like
    case 1:
      PostModel.updateOne(
        { _id: postId }, // Recupere l'id du post dans la requete (présente dans les paramètres de l'url)
        {
          $push: { likers: posterId }, // $push => ajout de l'id à l'array d'id de notre bdd pour les users qui like
          $inc: { like: 1 }, // $inc => Incrémentation du champ avec la nouvelle valeure (ici 1 car c'est un like) dans la BDD
        }
      )
        .then(() =>
          res
            .status(200)
            .json({ message: "L'utilisateur à like la publication !" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    //Dislike
    case -1:
      PostModel.updateOne(
        { _id: postId },
        {
          $push: { dislikers: posterId },
          $inc: { dislike: 1 },
        }
      )
        .then(() =>
          res
            .status(200)
            .json({ message: "L'utilisateur à dislike la publication !" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    case 0:
      PostModel.findOne({ _id: postId }) // Recuperation de l'id dans les paramètres de l'url
        .then((post) => {
          let data;
          let typeCompteur;
          // Si l'id du user est présent dans le tableau des likers (avec la méthode include qui renvoit true si c'est le cas)
          if (post.likers.includes(posterId)) {
            data = { likers: posterId };
            typeCompteur = { like: -1 };
          }
          // Si l'id du user est présent dans le tableau des dislikes
          if (post.dislikers.includes(posterId)) {
            data = { dislikers: posterId };
            typeCompteur = { dislike: -1 };
          }
          //Mise à jour de la BDD suivant les variables définit par les conditions qui précédent
          PostModel.updateOne(
            { _id: postId },
            {
              $pull: data,
              $inc: typeCompteur,
            }
          )
            .then(() => res.status(200).json({ message: "Annulation du vote" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    default:
      console.log("Une erreure est survenue !");
  }
};

// Comments
module.exports.createCommentPost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          commenterId: req.body.commenterId,
          commenterPseudo: req.body.commenterPseudo,
          text: req.body.text,
        },
      },
    },
    (error, docs) => {
      if (!error) return res.send(docs);
      else return res.status(400).send(error);
    }
  );
};

module.exports.updateCommentPost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  PostModel.findById(req.params.id, (err, docs) => {
    //On cherche la correspondance entre l'id du back et l'id du commentaire envoyé en Front
    const theComment = docs.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );
    UserModel.findById(req.body.commenterId).then((currentUser) => {
      if (
        theComment.commenterId != req.body.commenterId &&
        currentUser.admin == false
      ) {
        return res
          .status(500)
          .json({ message: "Vous n'avez pas les autorisations requises." });
      } else if (
        theComment.commenterId == req.body.commenterId ||
        currentUser.admin == true
      ) {
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;

        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      }
    });
  });
};

module.exports.deleteCommentPost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }
  PostModel.findById(req.params.id, (err, docs) => {
    //On cherche la correspondance entre l'id du back et l'id du commentaire envoyé en Front
    const theComment = docs.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );
    UserModel.findById(req.body.commenterId).then((currentUser) => {
      if (
        theComment.commenterId != req.body.commenterId &&
        currentUser.admin == false
      ) {
        return res
          .status(500)
          .json({ message: "Vous n'avez pas les autorisations requises." });
      } else if (
        theComment.commenterId == req.body.commenterId ||
        currentUser.admin == true
      ) {
        PostModel.findByIdAndUpdate(
          //Pointer le commentaire par son id
          req.params.id,
          {
            $pull: {
              comments: {
                _id: req.body.commentId, // On supprime le commentaire par son id
              },
            },
          },
          (error, docs) => {
            if (!error) return res.send(docs);
            else return res.status(400).send(error);
          }
        );
      }
    });
  });
};
