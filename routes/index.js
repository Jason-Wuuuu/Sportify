// import routes
import adminRoutes from "./admin.js";

const constructorMethod = (app) => {
  app.use("/admin", adminRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};
export default constructorMethod;
