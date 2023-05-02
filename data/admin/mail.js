import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(emailAddress, msg) {
  /*
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d43662a17b92ea",
      pass: "7ca121c04253c2",
    },
  });
  */

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "cs546sportify@gmail.com",
      pass: "nzrhdhjxhosqnhej",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "no-reply <cs546sportify@gmail.com>", // sender address
    to: emailAddress, // list of receivers
    subject: "Sportify", // Subject line
    text: msg, // plain text body
    html: `<h1>Sportify</h1><h2>${msg}</h2>`, // html body
  });

  console.log(`Mail successfully sent to ${emailAddress}!`);
}

// await sendMail("You are now an admin of Sportify!", "test@email.com");
export { sendMail };
