import * as admin from "./admins.js";
import * as sports from "./sports.js";
import * as classes from "./classes.js";
import * as sportPlaces from "./sportPlaces.js";

import { dbConnection, closeConnection } from "../../config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

await closeConnection();
console.log("\n\nDone!");
