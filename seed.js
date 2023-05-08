import * as user from "./data/user/users.js";
import * as events from "./data/user/events.js";
import * as admin from "./data/admin/admins.js";
import * as sports from "./data/admin/sports.js";
import * as classes from "./data/admin/classes.js";
import * as sportPlaces from "./data/admin/sportPlaces.js";
import * as timeSlot from "./data/admin/timeSlot.js";
import * as comments from "./data/user/comments.js";

import { dbConnection, closeConnection } from "./config/mongoConnection.js";

import { faker } from "@faker-js/faker";
import { users } from "./config/mongoCollections.js";

const db = await dbConnection();
await db.dropDatabase();

const number_of_data = 9;
const number_of_user_data = 20;
const number_of_admin_data = 5;
const admin_password = "Sportify@123";
let userIDList = [];
let adminIDList = [];
let sportID = [];
let sportPlacesID = [];
let classesID = [];
let createdEventsID = [];
let createdSlots = [];
let sportNames = ["Football", "Soccer", "Cricket", "Volleyball"];
let eventNames = ["NFL", "FIFA", "SuperBowl", "Grand Prix", "ICC World Cup"];
let eventThumbnail = [
  "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/nfl-1651510872.jpg?crop=1.00xw:0.989xh;0,0&resize=1200:*",
  "https://cdn1.epicgames.com/offer/f5deacee017b4b109476933f7dd2edbd/EGS_EASPORTSFIFA23StandardEdition_EACanada_S1_2560x1440-aaf9c5273c27a485f2cce8cb7e804f5c",
  "https://athlonsports.com/.image/t_share/MTk1NTE1NTI4ODk3MzczMjM1/superbowl_lvii_2023_state_logo_dl.jpg",
  "https://images.crazygames.com/games/crazy-grand-prix/cover-1669033093125.png?auto=format%2Ccompress&q=45&cs=strip&ch=DPR&w=1200&h=630&fit=crop",
  "https://pbs.twimg.com/card_img/1652524733081202688/eL_GGcFw?format=jpg&name=large",
];
let sportPlacesThumbnail = [
  "https://www.eye.co.jp/projects/examples/img/sports/spb15/1_l.jpg",
  "https://www.lcsd.gov.hk/file_upload_clpss/leisure_facilities/en/common/images/photo/facilities/WTS/723_HHRSG_02.jpg",
  "https://storage.needpix.com/rsynced_images/sports-ground-668615_1280.jpg",
  "https://www.lcsd.gov.hk/file_upload_clpss/leisure_facilities/en/common/images/photo/facilities/IL/857_cc01.jpg",
  "https://images.unsplash.com/photo-1606416550697-3d653df8d9a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3BvcnRzJTIwZmllbGR8ZW58MHx8MHx8&w=1000&q=80",
];
let classesThumbnail = [
  "https://recsports.ufl.edu/wp-content/uploads/2021/02/200227_Group-Fitness-Cycling_011.jpg",
  "https://studiogrowth.com/storage/2019/10/Group-fitness-class.jpg",
  "https://www.sadlersports.com/wp-content/uploads/Indiv-Instructor-2-small-Slider.jpg",
  "https://humankinetics.me/wp-content/uploads/2018/08/Basketball-coach-and-players-2.jpg",
  "https://www.betterteam.com/images/youth-sports-coach-job-description-4327x2885-20201126.jpeg?crop=40:21,smart&width=1200&dpr=2",
];

for (let i = 1; i <= number_of_user_data; i++) {
  try {
    let sex = faker.helpers.arrayElement([
      "male",
      "female",
      "transgender",
      "non-binary",
    ]);
    let fname = faker.name.firstName(sex);
    let lname = faker.name.lastName();
    let email = faker.internet.email(fname, lname);

    let birhtdate = faker.date
      .between("1960-01-01T00:00:00.000Z", "2008-01-01T00:00:00.000Z")
      .toISOString()
      .split("T")[0];
    let contactNumber = faker.phone.number("501######");
    let password = "Sportify@" + faker.internet.password(20, true, "Sportify@");

    const newUser = await user.create(
      fname,
      lname,
      email,
      sex,
      birhtdate,
      contactNumber,
      password
    );
    userIDList.push(newUser.userID);
  } catch (e) {
    console.log(e);
  }
}
console.log("Users Data Added!\n");

for (let i = 1; i <= number_of_admin_data; i++) {
  try {
    let sex = faker.helpers.arrayElement([
      "male",
      "female",
      "transgender",
      "non-binary",
    ]);
    let fname = faker.name.firstName(sex);
    let lname = faker.name.lastName();
    let email = faker.internet.email(fname, lname);

    let birhtdate = faker.date
      .between("1960-01-01T00:00:00.000Z", "2008-01-01T00:00:00.000Z")
      .toISOString()
      .split("T")[0];
    let contactNumber = faker.phone.number("501######");

    const newAdmin = await admin.create(
      fname,
      lname,
      email,
      sex,
      birhtdate,
      contactNumber,
      admin_password
    );
    adminIDList.push(newAdmin);
  } catch (e) {
    console.log(e);
  }
}
console.log("Admin Data Added!\n");

try {
  const newSport = await sports.createWithThumbanil(
    "Football",
    "https://image.cnbcfm.com/api/v1/image/106991253-1639786378304-GettyImages-1185558312r.jpg?v=1639786403"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Soccer",
    "https://cdn.britannica.com/51/190751-050-147B93F7/soccer-ball-goal.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Cricket",
    "https://www.nysenate.gov/sites/default/files/in-the-news/main-image/istockphoto-177427917-612x612.jpeg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Volleyball",
    "https://tarletonsports.com/images/2022/8/16/Photo_Aug_09__6_55_13_PM-2.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Chess",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ChessSet.jpg/800px-ChessSet.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Hockey",
    "https://media.istockphoto.com/id/921770360/vector/ice-hockey.jpg?s=612x612&w=0&k=20&c=MUr6NO69T3d0eQVNXu2qYhfvx5OF-zgb1tU8lo6wDG0="
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}
try {
  const newSport = await sports.createWithThumbanil(
    "Baseball",
    "https://gray-wcsc-prod.cdn.arcpublishing.com/resizer/ycrpUu7VTbJmTwElSfUPF7YF89I=/1200x1200/smart/filters:quality(85)/cloudfront-us-east-1.images.arcpublishing.com/gray/OD32P4633VALXF2XGLJGRHR4VE.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

try {
  const newSport = await sports.createWithThumbanil(
    "taekwondo",
    "https://koryo.club/wp-content/uploads/2022/01/What-is-the-order-of-belts-in-Taekwondo.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

try {
  const newSport = await sports.createWithThumbanil(
    "Golf",
    "https://play-lh.googleusercontent.com/DJueER9q3UPYjWnyXwUP3NF_wgKZ_dtIGhU2T-ibVo2W8EDyNHYG-0SNAuSH-D48XQ"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

try {
  const newSport = await sports.createWithThumbanil(
    "Yoga",
    "https://images.healthshots.com/healthshots/en/uploads/2022/05/11184715/Yoga-for-weight-loss.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

try {
  const newSport = await sports.createWithThumbanil(
    "Zumba",
    "https://s3-us-west-1.amazonaws.com/contentlab.studiod/getty/d11ce039f4ff44b0bd8d9e414891e8fe"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

try {
  const newSport = await sports.createWithThumbanil(
    "Swimming",
    "https://c4.wallpaperflare.com/wallpaper/579/635/598/michael-phelps-swimmer-olympian-wallpaper-preview.jpg"
  );
  sportID.push(newSport.sportID);
} catch (e) {
  console.log(e);
}

console.log("Sports Data Added!\n");

for (let x = 0; x < 4; x++) {
  let sport_id = sportID[x];
  let placesarr = [];
  for (let i = 0; i < 5; i++) {
    let fullname = faker.name.fullName() + " Stadium";
    let state = faker.address.stateAbbr();
    let address =
      faker.address.streetAddress() +
      ", " +
      state +
      ", " +
      faker.address.zipCodeByState(state);
    let description = faker.lorem.paragraph();
    let capacity = Math.floor(Math.random() * 10) + 1;

    let price = Math.floor(Math.random() * 250) + 1;
    price.toString();
    let thumbnail = sportPlacesThumbnail[i];
    let subArraySize = Math.floor(Math.random() * (capacity - 1)) + 1;
    let randomIndex = Math.floor(
      Math.random() * (userIDList.length - subArraySize)
    );
    let userslist = userIDList.slice(randomIndex, randomIndex + subArraySize);
    capacity = capacity.toString();

    try {
      const newSportPlace = await sportPlaces.createplaceswiththumbnail(
        fullname,
        sport_id,
        address,
        description,
        capacity,
        price,
        thumbnail,
        userslist
      );
      let sportPlaceID = newSportPlace.sportPlaceID.toString();
      placesarr.push(sportPlaceID);
    } catch (e) {
      console.log(e);
    }
  }
  sportPlacesID.push(placesarr);
}
console.log("SportPlaces Data Added for first 4 Sports!");

for (let x = 0; x < 4; x++) {
  let sport_id = sportID[x];
  let classarr = [];
  for (let i = 0; i < 5; i++) {
    let instructor = faker.name.fullName();
    let title = instructor + "'s Class";
    let splaceID = sportPlacesID[x][i];
    let capacity = Math.floor(Math.random() * 10) + 1;

    let price = Math.floor(Math.random() * 250) + 1;
    price.toString();
    let thumbnail = classesThumbnail[i];
    let subArraySize = Math.floor(Math.random() * (capacity - 1)) + 1;
    let randomIndex = Math.floor(
      Math.random() * (userIDList.length - subArraySize)
    );
    let studentslist = userIDList.slice(
      randomIndex,
      randomIndex + subArraySize
    );
    capacity = capacity.toString();
    let date = faker.date
      .between("2023-05-20T00:00:00.000Z", "2023-05-30T00:00:00.000Z")
      .toISOString()
      .split("T")[0];

    let hour = Math.floor(Math.random() * 12) + 12;
    let minute = Math.floor(Math.random() * 60);

    let endTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    hour = Math.floor(Math.random() * 12);
    minute = Math.floor(Math.random() * 60);

    let startTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    try {
      const newClass = await classes.createdb(
        title,
        sport_id,
        splaceID,
        capacity,
        instructor,
        price,
        date,
        startTime,
        endTime,
        thumbnail,
        studentslist
      );
      let cla_id = newClass.classID.toString();
      classarr.push(cla_id);
    } catch (e) {
      console.log(e);
    }
  }
  classesID.push(classarr);
}
console.log("\nClasses Data Added for first 4 Sports!");

let slotDates = [];

for (let i = 0; i <= 30; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  slotDates.push(date.toISOString().split("T")[0]);
}

for (let d in slotDates) {
  for (let a in sportPlacesID) {
    let sportsid = sportID[a];
    for (let b in sportPlacesID[a]) {
      let spID = sportPlacesID[a][b];
      for (let i = 1; i < 4; i++) {
        try {
          const newSlot = await timeSlot.create(
            sportsid,
            spID,
            slotDates[d],
            i
          );
          let slot_id = newSlot.slotID.toString();
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}
console.log(
  "\n1860 Slots created for first 4 Sports and all the Sportsplaces for that sport!"
);

for (let x = 0; x < 4; x++) {
  let sport_name = sportNames[x];
  let eventsarr = [];
  for (let i = 0; i < 5; i++) {
    let user = userIDList[i];
    let eventname = eventNames[i] + "'s Event";
    let splaceID = sportPlacesID[x][i];
    let splace = await sportPlaces.get(splaceID);
    let splacename = splace.name;
    let description = faker.lorem.paragraph();
    let capacity = Math.floor(Math.random() * 10) + 1;

    let thumbnail = eventThumbnail[i];
    let subArraySize = Math.floor(Math.random() * (capacity - 1)) + 1;
    let randomIndex = Math.floor(
      Math.random() * (userIDList.length - subArraySize)
    );
    let studentslist = userIDList.slice(
      randomIndex,
      randomIndex + subArraySize
    );
    capacity = capacity.toString();
    let date = faker.date
      .between("2023-05-20T00:00:00.000Z", "2023-05-30T00:00:00.000Z")
      .toISOString()
      .split("T")[0];

    let hour = Math.floor(Math.random() * 12) + 12;
    let minute = Math.floor(Math.random() * 60);

    let endTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    hour = Math.floor(Math.random() * 12);
    minute = Math.floor(Math.random() * 60);

    let startTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    try {
      const newEvent = await events.create(
        user,
        eventname,
        description,
        sport_name,
        splacename,
        capacity,
        date,
        startTime,
        endTime,
        thumbnail,
        studentslist
      );
      let eve_id = newEvent.eventID.toString();
      eventsarr.push(eve_id);
    } catch (e) {
      console.log(e);
    }
  }
  createdEventsID.push(eventsarr);
}
console.log("\nEvent Data Added for first 4 Sports!");

function randomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date;
}

const startDate = new Date("2023-06-01");
const endDate = new Date("2023-06-07");

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    let comment_event = createdEventsID[i][j];
    for (let k = 0; k < 5; k++) {
      let user_i_d = userIDList[k];
      let user_name = faker.name.firstName() + " " + faker.name.lastName();
      let comment = faker.lorem.paragraph();
      let timestamp = randomDate(startDate, endDate);
      try {
        const newComm = await comments.create(
          comment_event,
          user_i_d,
          user_name,
          comment,
          timestamp
        );
        let comm_id = newComm.commID.toString();
      } catch (e) {
        console.log(e);
      }
    }
  }
}
console.log("\nComments added for all the events of first 4 Sports!");

await closeConnection();
console.log("\nDone!");
