// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const moment = require("moment");
const cors = require("cors");
const ytdl = require("ytdl-core");
const fs = require("fs");
var query = require("samp-query");
var fetch = require("node-fetch")

//Static Script
const covid = require("./script/covid");
const resi = require("./script/cekresi");
const PrayTimes = require("./script/sholat");
const youtube = require("./script/yt");
const texttoimg = require('./script/texttoimg')
const Nulis = require('./script/nulis')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

app.use(express.json());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, response) => {
  response.sendFile(__dirname + "/views/index.html");
  console.log(req.protocol + "://" + req.get("host") + req.originalUrl);
});

app.get("/api/v1/cekresi", async (req, res) => {
  const ekspedisi = req.query.eks;
  const res1 = req.query.resi;
  res.json(await resi.cekResi(ekspedisi, resi));
});

app.get("/api/v1/tiktok", asysnc (req, res) => {
  const link = req.query.link;
  const wm = req.query.wm;
  if(link == undefine){
    res.status('400').send({
      message:'Invalid Tiktok URL'
    })
  }
  fetch('https://')
    .then(res => res.json()) // expecting a json response
    .then(json => console.log(json));
}

app.get("/api/v1/texttoimg", async (req, res) => {
  const text = req.query.text;
  if (text == undefined) {
    res.status('400').send({
      message:'No Text Founded'
    })
  }
});

app.get("/api/v1/youtube", async (req, res) => {
   var link = req.query.link || req.query.url;
   if(link == undefined) {
      res.status("400").send({
        message:"Ketikkan URL yang akan di ambil vidionya"
      })
   }
   fetch('https://alfians-api.herokuapp.com/api/yta?url='+link).then(response => (res.json(response.data.))
})

app.get("/api/v1/nulis", async (req, res) => {
   var text = req.query.text;
   if(text == undefined) {
      res.status("400").send({
        message:"Ketikkan Text Yang Akan Di Tulis"
      })
   }
   Nulis.Nulis(text).then(ress => {
                        ress.map(link => {
                            res.json(link);
                        })
                    })
                    .catch(err => {
                        res.status("404").send({
                        message:'[NULIS] Error:'+err
                      })
                    })
})

app.get("/api/v1/facebook", async (req, res) => {
  const link = req.qeury.url;
  if (link == undefined) {
    res.status("400").send({
      message: "kode : 0"
    });
  }
  fb.scrap(link);
});

app.get("/api/v1/samp", async (req, res) => {
  var ip = req.query.ip;
  var port = req.query.port;
  if (
    (ip == "0.0.0.0") | "127.0.0.1" ||
    port < 1000 ||
    port == undefined ||
    ip == undefined
  ) {
    return res.status(400).send({
      message: "Invalid IP Or Port!"
    });
  }
  var options = {
    host: ip,
    port: port
  };
  query(options, function(error, response) {
    if (error)
      return res.status(400).send({
        message: error
      });
    else res.json(response);
  });
});

app.get("/api/v1/sholat", async (req, res) => {
  const endDate = moment().add(1, "days");
  const currentDate = moment();
  var praytimesSchedules = [];
  PrayTimes.setMethod("Karachi");
  var lat = req.query.lat;
  var lon = req.query.long;
  var long = lon;
  if (
    lat == "-1" ||
    long == "-1" ||
    long === "" ||
    lat === "" ||
    lat == undefined ||
    long == undefined
  ) {
    return res.status(400).send({
      message: "Invalid Langitude Or Longitude!"
    });
  }
  // console.log(`curren date = ${currentDate.format('YYYY-MM-DD')}`);
  while (currentDate.isBefore(endDate, "day")) {
    var loopDay = currentDate.format("YYYY-MM-DD");
    var praytimesLoop = PrayTimes.getTimes(
      currentDate.toDate(),
      [lat, lon],
      +7
    );
    praytimesLoop.date = loopDay;
    praytimesSchedules.push(praytimesLoop);
    // currentDate.add(1, 'days');
    currentDate.add(1, "days");
  }
  // var toDay = moment();
  // var singleSchedule = PrayTimes.getTimes(toDay.toDate(), [lat, lon], +7);
  // singleSchedule.date = toDay.format('YYYY-MM-DD');
  res.status(200).send({
    success: true,
    schedules: praytimesSchedules
    // schedule: singleSchedule
  });
});

app.get("/api/v1/covid", async (request, response) => {
  const lat = request.query.lat;
  const long = request.query.long;
  if (
    lat == "-1" ||
    long == "-1" ||
    long === "" ||
    lat === "" ||
    lat == undefined ||
    long == undefined
  ) {
    return response.status(400).send({
      message: "Invalid Latitude Or Longitude!",
      message: "Lat for  Latitude and Long for Logtitude"
    });
  }
  var res = await covid.getLocationData(lat, long);
  response.json(res);
});

// listen for requests :)
const listener = app.listen('80', () => {
  console.log("Your app is listening on port " + listener.address().port);
});

