import express from "express";
import cors from "cors"

const app = express();
const port = 5000;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World")
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ALLOWED_ORIGINS = ["http://localhost:3000"];
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));