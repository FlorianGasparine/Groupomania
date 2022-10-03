const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

mongoose
  .connect(
    `mongodb+srv://${process.env.IdPassMongoDb}@groupomania.evdxuyp.mongodb.net/${process.env.dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB !"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
