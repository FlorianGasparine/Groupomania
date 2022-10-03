const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxLength: 240,
    },

    picture: {
      type: String,
    },

    like: {
      type: Number,
      default: 0,
      min: 0,
    },

    dislike: {
      type: Number,
      default: 0,
      min: 0,
    },

    likers: {
      type: [String],
    },

    dislikers: {
      type: [String],
    },

    // Création d'une sous BDD pour les commentaires
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: {
            type: String,
            maxLength: 240,
          },
          timestamp: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
