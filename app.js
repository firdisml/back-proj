const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const userModel = require("./model/transaction");
const app = express();
const cors = require("cors");
const log = require('./utils/logger.js');
const conf = require('./utils/conf.js');
app.use(express.json());
app.use(cors());

var admin = require("firebase-admin");

var serviceAccount = require("./tuitionsystem.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

conf.appName = 'FirebaseAdmin';
conf.version = '1.0.0';
conf.LMD = '2022-07-22';
console.log(conf.appName + ', ' + conf.version + ', ' + conf.LMD);
if (process.argv.includes('-v')) {
  return
}

// mongoose.connect('mongodb://localhost:27017/mongodb',
//   {
//     useNewUrlParser: true, useUnifiedTopology: true
//   }
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

// ESConn.checkConnectionInterval();

app.post("/deleteusers", async (request, response) => {
  try {
    admin.auth().deleteUser(request.body.uid) // lists up to 1000 users
      .then(() => {
        response.send({ status: 'success' });
      })
      .catch(function (error) {
        console.log('Oh no! Firebase listUsers Error:', error);
        response.status(500).send(error);
      });
  } catch (e) {
    console.log(e)
    response.status(500).send(e);
  }

});

// getAuth()
//   .createUser({
//     uid: 'some-uid',
//     email: 'user@example.com',
//     phoneNumber: '+11234567890',
//   })
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log('Successfully created new user:', userRecord.uid);
//   })
//   .catch((error) => {
//     console.log('Error creating new user:', error);
//   });


app.post("/createNewUser", async (request, response) => {
  const password=request.body.password
  const email=request.body.email
  admin.auth()
  .createUser({
    email: email,
    password: password,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    response.send({status:'success', id:userRecord.uid});
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    response.send({status:'fail', id:''});
    console.log('Error creating new user:', error);
  });
});

app.get("/getUserList", async (request, response) => {
  admin.auth().listUsers(1000) // lists up to 1000 users
    .then((listUsersResult) => {

      let users = JSON.stringify(listUsersResult);
      response.send(users);
    })
    .catch(function (error) {
      console.log('Oh no! Firebase listUsers Error:', error);
      response.status(500).send(error);
    });
});


app.listen(3005, () => {
  console.log("Server is running at port 3005");
});