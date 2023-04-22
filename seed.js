import * as user from "./data/user/users.js";
import * as admin from "./data/admin/admins.js";
import * as sports from "./data/admin/sports.js";
import * as classes from "./data/admin/classes.js";
import * as sportPlaces from "./data/admin/sportPlaces.js";

import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

const number_of_data = 9;

// add valid data
for (let i = 1; i <= number_of_data; i++) {
  try {
    let gender = "male";
    if (i % 2 == 0) gender = "female";
    const newUser = await user.create(
      `User_0${i}_FN`,
      `User_0${i}_LN`,
      `user_0${i}@stevens.edu`,
      gender,
      `1995-03-0${i}`,
      `123456789${i}`,
      `password${i}`
    );
    // console.log(newAdmin);
  } catch (e) {
    console.log(e);
  }

  try {
    let gender = "male";
    if (i % 2 == 0) gender = "female";
    const newAdmin = await admin.create(
      `Admin_0${i}_FN`,
      `Admin_0${i}_LN`,
      `admin_0${i}@stevens.edu`,
      gender,
      `1995-03-0${i}`,
      `123456789${i}`,
      `password${i}`
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
      `SportPlace_0${i}`,
      `Sport_0${i}`,
      `address_for_SportPlace_0${i}`,
      `This is the description of SportPlace_0${i}`,
      `${(i + 5) * 10}`,
      `${(i + 10) * 50}`
    );
    sportPlaceID = newSportPlace._id;
    // console.log(newSportPlace);
  } catch (e) {
    console.log(e);
  }

  try {
    const newClass = await classes.create(
      `Class_0${i}`,
      `Sport_0${i}`,
      `sportPlace_0${i}`,
      `${(i + 5) * 3}`,
      `instructor_0${i}`,
      `2023-05-${i + 10}`,
      `0${i}:00`,
      `0${i}:45`
    );
    // console.log(newClass);
  } catch (e) {
    console.log(e);
  }
}

console.log(`${number_of_data} new valid users added.`);
console.log(`${number_of_data} new valid admins added.`);
console.log(`${number_of_data} new valid sports added.`);
console.log(`${number_of_data} new valid sport places added.`);
console.log(`${number_of_data} new valid classes added.`);

// add invalid data

await closeConnection();
console.log("Done!");
