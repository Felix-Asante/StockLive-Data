const Logger = require("../models/Logger");
let { google } = require("googleapis");
let privatekey = require("./secure-way-312415-ceb7928e000d.json");

// import path ° directories calls °
var path = require("path");
// import fs ° handle data in the file system °
var fs = require("fs");

const livedataMigrateFromMongodbToGoogleDrive = (collectionName) => {
  // configure a JWT auth client
  let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Successfully connected!");
      console.log(tokens);
    }
  });

  let drive = google.drive("v3");

  // list file in speciifcs folder
  var parents = "1eDvoG_iuuFYJU3bEWJvi_A7pVZT83XDI";
  drive.files.list(
    {
      auth: jwtClient,
      pageSize: 10,
      q: "'" + parents + "' in parents and trashed=false",
      fields: "files(id, name)",
    },
    (err, { data }) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = data.files;
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );

  // upload file in specific folder
  var folderId = "1eDvoG_iuuFYJU3bEWJvi_A7pVZT83XDI";
  var currentDate = new Date();
  var filename = currentDate.toString() +collectionName+".csv";
  var fileMetadata = {
    name: filename,
    parents: [folderId],
  };

  var media = {
    mimeType: "text/csv",
    body: fs.createReadStream(path.join(__dirname, "./images/"+collectionName+".csv")),
  };

  drive.files.create(
    {
      auth: jwtClient,
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log("File Id: ", file.data.id);
        fs.unlinkSync(path.join(__dirname, "./images/"+collectionName+".csv"));
        let logger = new Logger();
        logger.message = filename + " saved !!";
        logger.fileId = file.data.id;
        logger.save();
      }
    }
  );
};

module.exports = livedataMigrateFromMongodbToGoogleDrive;
