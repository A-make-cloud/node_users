import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { apiOrApp } from "./utilities";
// import { SystemError } from "./exceptions";
import usersRoutes from "./routes/users.route";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import flash from "express-flash";
import session from "express-session";
import * as helpers from "./helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use('/', (req, res) => {
  res.send('hello')
})
app.engine("handlebars", engine({ helpers }));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: "abcde" }));
app.use(flash());
app.use(apiOrApp);

app.use("/users", usersRoutes);
app.use("/app", usersRoutes);
console.log(__dirname);
app.use("/static", express.static(`${__dirname}/public`));

app.listen(process.env.PORT || 3000, () => {
  console.log(`le serveur est lancé ${process.env.PORT}`);
});
