const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
router.use(express.json())
router.use(express.urlencoded({ extended: false }))
const usersCollection = require("./db").collection("password2")
const perf = require("execution-time")()
perf.start()
var useragent = require("express-useragent")
var ip = require("ip")
const axios = require("axios")
var device = require("express-device")
var url = require("url")
var urlparse = require("url-parse")
var emailUser
var time
var endtime
var minutes
var seconds
var hours
var timings
router.use(device.capture())
router.use(useragent.express())
router.get("/", userController.home)
router.post("/register", userController.register)
router.get("/next", userController.next)
router.get("/exhibition", userController.mustBeLoggedIn, userController.exhibition)
router.get("/lobby", userController.mustBeLoggedIn, userController.lobby)
async function userdata1(req, res, next) {
  endtime = perf.stop()
  timings = endtime.time
  ;(seconds = Math.floor((timings / 1000) % 60)), (minutes = Math.floor((timings / (1000 * 60)) % 60)), (hours = Math.floor((timings / (1000 * 60 * 60)) % 24))

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds
  var endtimings = hours + ":" + minutes + ":" + seconds
  const query = { email: emailUser }
  const update = { $set: { AverageSession: endtimings } } //your update in json here
  await usersCollection.findOneAndUpdate(query, update, false, true)
  next()
}
router.get("/logOut", userdata1, userController.logOut)
async function userdata(req, res, next) {
  var browser = req.useragent.browser
  var version = req.useragent.version
  var ip1 = ip.address()
  var os = req.useragent.os
  var platform = req.useragent.platform
  emailUser = req.body.email
  var device = req.device.type.toUpperCase()
  const query = { email: emailUser }
  const update = { $set: { browser: browser, version: version, OS: os, platform: platform, device: device, Logindate: time, IP: ip1, AverageSession: endtime } } //your update in json here
  await usersCollection.findOneAndUpdate(query, update, false, true)
  next()
}

router.post("/login", userdata, userController.login)
router.post("/lobby", userdata, async function (req, res, next) {
  time = req.body.date
  next()
})

async function boothVisitor1(req, res, next) {
  var url = req.protocol + "://" + req.get("host") + req.originalUrl
  const query = { email: emailUser }
  const update = { $set: { Booth1: url } } //your update in json here
  const update1 = { $inc: { Booth1count: 1 } }
  await usersCollection.findOneAndUpdate(query, update, false, true)
  await usersCollection.findOneAndUpdate(query, update1, false, true)

  next()
}
async function boothVisitor2(req, res, next) {
  var url = req.protocol + "://" + req.get("host") + req.originalUrl
  const query = { email: emailUser }
  const update = { $set: { Booth2: url } } //your update in json here
  const update1 = { $inc: { Booth2count: 1 } }
  await usersCollection.findOneAndUpdate(query, update, false, true)
  await usersCollection.findOneAndUpdate(query, update1, false, true)
  next()
}
async function boothVisitor3(req, res, next) {
  var url = req.protocol + "://" + req.get("host") + req.originalUrl
  const query = { email: emailUser }
  const update = { $set: { Booth3: url } } //your update in json here
  const update1 = { $inc: { Booth3count: 1 } }
  await usersCollection.findOneAndUpdate(query, update, false, true)
  await usersCollection.findOneAndUpdate(query, update1, false, true)
  next()
}
router.get("/DigitalExperienceBooth", userController.mustBeLoggedIn, boothVisitor1, userController.digital)
router.get("/InnovationBooth", userController.mustBeLoggedIn, boothVisitor2, userController.innovation)
router.get("/PracticePartnershipBooth", userController.mustBeLoggedIn, boothVisitor3, userController.partnership)
router.post("/form", userController.mustBeLoggedIn, userController.form)
router.get("/agenda", userController.mustBeLoggedIn, userController.agenda)
router.get("/symposiumhall", userController.mustBeLoggedIn, userController.symposiumhall)
router.get("/symposiumday2", userController.mustBeLoggedIn, userController.symposiumday2)
router.get("/main", userController.mustBeLoggedIn, userController.main)

module.exports = router
