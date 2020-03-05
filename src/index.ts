import express from "express";
import connectDatabase from "./db/connect";
import User from "./models/User";
import userRouter from "./routes/User";
import authRouter from "./routes/auth";

connectDatabase();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    version: "v1",
    type: "REST"
  });
});

/*
  CRUD Route for Users
*/
app.use("/api/users", userRouter);

app.use("/api/auth", authRouter);

app.listen(5000, () => console.log("serving on http://localhost:5000"));
