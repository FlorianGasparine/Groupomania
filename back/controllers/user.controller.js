const UserModel = require("../models/User.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");

module.exports.userProfil = (req, res) => {
  console.log(req.params);
  // Controle si l'id passé en params est connu
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("ID unknown : " + err);
    }
  }).selected("-password");
};

module.exports.updateUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }

  UserModel.findOne({ _id: req.params.id }).then((user) => {
    if (user === null) {
      res.status(401).json({
        message: "Modification impossible", //On reste vague dans les messages d'erreur afin de prévenir toutes fuites d'informations
      });
    } else if (req.body._id == user._id) {
      const imageObject = req.file
        ? {
            ...req.body,
            picture: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };

      UserModel.updateOne(
        { _id: req.params.id },
        { ...imageObject, _id: req.params.id }
      )
        .then(() =>
          res.status(200).json({ message: "L'utilisateur a bien été modifié" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else {
      res.status(401).json({
        message: "Vous n'avez pas l'autorisation",
      });
    }
  });
};

module.exports.deleteUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }
  UserModel.findOne({ _id: req.params.id })
    .then((user) => {
      if (user._id == req.body._id) {
        const filename = user.picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          UserModel.deleteOne({ _id: req.params.id })
            .then(() =>
              res
                .status(200)
                .json({ message: "L'utilisateur a bien été supprimé !" })
            )
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res.status(401).json({
          message: "Vous n'avez pas l'autorisation",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
