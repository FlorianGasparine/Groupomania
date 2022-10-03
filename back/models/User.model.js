const mongoose = require("mongoose");

// Import package npm pour la validation de l'email
const { isEmail } = require("validator");

//Import package npm pour la verification de l'unicité de la clé du schema
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 30,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: [isEmail],
      trim: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 5,
      trim: true,
    },
    picture: {
      type: String,
    },

    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
