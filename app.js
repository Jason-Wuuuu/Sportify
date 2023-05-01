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

// middleware for admin
app.all("/admin", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  return res.redirect("/admin/profile");
});

app.use("/admin/login", (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin/profile");
  }
  next();
});

app.use("/admin/register", (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin/profile");
  }
  next();
});

app.use("/admin/profile", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "PUT";
  next();
});

app.use("/admin/users", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/users/remove/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "DELETE";
  next();
});

app.use("/admin/users/:id", (req, res, next) => {
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

app.use("/admin/classes/remove/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "DELETE";
  next();
});

app.use("/admin/classes/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "PUT";
  next();
});

app.use("/admin/sports", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/sports/remove/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "DELETE";
  next();
});

app.use("/admin/sports/:id", (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  if (req.method === "POST") req.method = "PUT";
  next();
});

app.use("/admin/sportPlaces", (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  next();
});

app.use("/admin/sportPlaces/remove/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "DELETE";
  next();
});

app.use("/admin/sportPlaces/:id", (req, res, next) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  if (req.method === "POST") req.method = "PUT";
  next();
});

app.use("/admin/events", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

app.use("/admin/events/remove/:id", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  if (req.method === "POST") req.method = "DELETE";
  next();
});

app.use("/admin/logout", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
});

// middleware for users
app.use("/events/:sports", (req, res, next) => {
  if (!req.session.user && !req.session.admin) {
    return res.redirect("/");
  }
  next();
});

app.use("/addevent/:sports", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
});

app.use("/myevents", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
});

app.use("/events/:sports/register/:eventid", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
});
app.use("/events/:sports/deregister/:eventid", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
});

app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
});

app.use("/register", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
});

app.use("/profile", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (req.method === "POST") req.method = "PUT";
  next();
});

app.use(async (req, res, next) => {
  const currentTime = new Date().toUTCString();
  const req_method = req.method;
  const req_route = req.originalUrl;
  let authenticated = "Non-Authenticated User";
  if (req.session.user) authenticated = "Authenticated User";
  if (req.session.admin) authenticated = "Admin";

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
