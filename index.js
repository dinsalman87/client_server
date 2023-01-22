import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import path from "path";

import { login, signup, sendForgotPasswordEmail } from "./mongo_logic/users.js";
import { getTreatments, addNewTreatment, deleteTreatment, editTreatment } from "./mongo_logic/treatments.js";

// git token = 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

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.post("/login", login);
app.post("/sign-up", signup);
app.post("/forgot-password", sendForgotPasswordEmail);

app.get("/treatments", getTreatments);
app.post("/treatments", addNewTreatment);
app.delete("/treatments", deleteTreatment);
app.put("/treatments", editTreatment);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/DashboardPage.html")));
app.get("/index", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/DashboardPage.html")));
app.get("/tables", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/ManageCarServicesPage.html")));
app.get("/about-us", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/AboutUsPage.html")));

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/SignInPage.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/SignUpPage.html")));
app.get("/forgot-password", (req, res) =>
  res.sendFile(path.join(__dirname, "/ui/pages/ForgotPasswordPage.html"))
);

app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "/ui/pages/NotFoundPage.html")));

const port = 3000;

const CONNECTION_URL = `mongodb+srv://din123:BslNkly5Z0YHrhhw@cluster0.isbphej.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log("listening...  http://localhost:" + port);
    });
  })
  .catch((err) => console.log(err));
