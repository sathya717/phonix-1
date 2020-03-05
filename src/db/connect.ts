import mongoose from "mongoose";

export default function() {
  mongoose.connect(
    "mongodb://localhost:27017/phonix",
    { useNewUrlParser: true },
    err => {
      if (err) {
        console.log(`Failed to connect to database`);
        return;
      }

      console.log(
        "%c Successfully connected to database!",
        "background : #222,color : #bada55"
      );
    }
  );
}
