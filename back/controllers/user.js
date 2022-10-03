const UserModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new UserModel({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ user: user._id }))
        .catch((error) => res.status(400).json({ message: error }));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.login = (req, res, next) => {
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      //User n'est pas dans la BDD
      if (user === null) {
        res
          .satus(401)
          .json({ message: "Identifiant ou mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res
              .status(401)
              .json({ message: "Identifiant ou mot de passe incorrecte" });
          } else {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                {
                  expiresIn: "24h",
                }
              ),
            });
          }
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};
