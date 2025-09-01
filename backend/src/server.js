import dotenv from "dotenv";
import ExpressApplication from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = new ExpressApplication(PORT);

app.start();