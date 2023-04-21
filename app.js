import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.all("/admin", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  return res.redirect("/admin/home");
});

app.use("/admin/login", (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin/home");
  }
  next();
});

app.use("/admin/register", (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin/home");
  }
  next();
});

app.use("/admin/home", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/profile", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/classes", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/sports", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/sportPlaces", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/logout", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use(async (req, res, next) => {
  const currentTime = new Date().toUTCString();
  const req_method = req.method;
  const req_route = req.originalUrl;
  let authenticated = "Non-Authenticated Admin";
  if (req.session.admin) authenticated = "Authenticated Admin";

  const log_msg = `[${currentTime}]: ${req_method} ${req_route} (${authenticated})`;
  console.log(log_msg);

  next();
});

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
