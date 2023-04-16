import * as admin from "./data/admin/admins.js";
import * as sports from "./data/admin/sports.js";
import * as classes from "./data/admin/classes.js";
import * as sportPlaces from "./data/admin/sportPlaces.js";

import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

const number_of_data = 10;

// add valid data
for (let i = 0; i < number_of_data; i++) {
  try {
    let gender = "M";
    if (i % 2 == 0) gender = "F";
    const newAdmin = await admin.create(
      `Admin_0${i}_FN`,
      `Admin_0${i}_LN`,
      `admin_0${i}@gmail.com`,
      gender,
      `03-0${i}-1995`,
      `123-456-789${i}`
    );
    // console.log(newAdmin);
  } catch (e) {
    console.log(e);
  }

  let sportID = undefined;
  try {
    const newSport = await sports.create(`Sport_0${i}`);
    sportID = newSport._id;
    // console.log(newSport);
  } catch (e) {
    console.log(e);
  }

  let sportPlaceID = undefined;
  try {
    const newSportPlace = await sportPlaces.create(
      sportID,
      `address_for_SportPlace_0${i}`,
      `This is the description of SportPlace_0${i}`,
      (i + 5) * 10,
      (i + 10) * 50
    );
    sportPlaceID = newSportPlace._id;
    // console.log(newSportPlace);
  } catch (e) {
    console.log(e);
  }

  try {
    const newClass = await classes.create(
      `Class_0${i}`,
      sportID,
      sportPlaceID,
      (i + 5) * 3,
      `instructor_0${i}`,
      `05-0${i + 10}-2023`
    );
    // console.log(newClass);
  } catch (e) {
    console.log(e);
  }
}

console.log(`${number_of_data} new valid admins added.`);
console.log(`${number_of_data} new valid sports added.`);
console.log(`${number_of_data} new valid sport places added.`);
console.log(`${number_of_data} new valid classes added.`);

// add invalid data

await closeConnection();
console.log("Done!");
