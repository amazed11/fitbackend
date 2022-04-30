const express = require("express");
const pool = require("mysql2");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/uploads", express.static("uploads"));
const db = pool.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "fitrest",
});

if (db) {
  console.log("db connected");
}

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.post("/login", (req, res) => {
  const user = req.body.email;
  const password = req.body.password;
  db.query(
    `select * from users where email=? and password=?`,
    [user, password],
    function (err, results, fields) {
      if (results.length > 0) {
        return res.status(200).json({
          status: true,
          message: "success",
          data: results[0],
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "failed",
        });
      }
    }
  );
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const phone = req.body.phone;
  db.query(
    `insert into users(username,email,phone,password) value(?,?,?,?)`,
    [username, email, phone, password],
    function (err, results, fields) {
      if (results) {
        return res.status(201).json({
          status: true,
          message: "success",
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "failed",
        });
      }
    }
  );
});

//upload file
// handle storage using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

var upload = multer({ storage: storage });

// handle single file upload
app.post("/createfood", upload.single("image"), (req, res, next) => {
  const file = req.file;
  const fname = req.body.fname;
  const fcalories = req.body.fcalories;
  const frecipe = req.body.frecipe;
  const fcategory = req.body.fcategory;
  const fdesc = req.body.fdesc;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }
  //   var sql = "INSERT INTO `food`(`name`) VALUES ('" + req.file.filename + "')";
  var sql =
    "INSERT INTO `food`(`fname`, `fdesc`, `fcalories`, `frecipe`, `fcategory`, `fimg`) VALUES (?,?,?,?,?,?)";
  var query = db.query(
    sql,
    [fname, fdesc, fcalories, frecipe, fcategory, file.filename],
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: false,
          message: "failed to create food",
        });
      }
      return res
        .status(200)
        .send({ message: "Successfully created food.", file });
    }
  );
});

//get all foods
app.get("/getfood/:catname", (req, res) => {
  const fcatname = req.params.catname;
  var sql = "select * from `food` where fcategory=?";
  var query = db.query(sql, [fcatname], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: false,
        message: "failed to get",
      });
    }
    return res
      .status(200)
      .send({ message: "Successfully fetched.", status: true, data: result });
  });
});

//exercise
app.post("/createxercise", upload.single("image"), (req, res, next) => {
  const file = req.file;
  const ename = req.body.ename;
  const ereps = req.body.ereps;
  const edesc = req.body.edesc;

  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }
  //   var sql = "INSERT INTO `food`(`name`) VALUES ('" + req.file.filename + "')";
  var sql =
    "INSERT INTO `exercise`( `ename`, `ereps`, `edesc`, `eimg` ) VALUES (?,?,?,?)";
  var query = db.query(
    sql,
    [ename, ereps, edesc, file.filename],
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: false,
          message: "failed to create exercise",
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "Successfully created exercise." });
    }
  );
});

//get all foods
app.get("/getexercise", (req, res) => {
  var sql = "select * from `exercise`";
  var query = db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: false,
        message: "failed to get",
      });
    }
    return res
      .status(200)
      .send({ message: "Successfully fetched.", status: true, data: result });
  });
});

//favourites
//exercise
app.post("/createxercise", upload.single("image"), (req, res, next) => {
  const file = req.file;
  const ename = req.body.ename;
  const ereps = req.body.ereps;
  const edesc = req.body.edesc;

  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }
  //   var sql = "INSERT INTO `food`(`name`) VALUES ('" + req.file.filename + "')";
  var sql =
    "INSERT INTO `exercise`( `ename`, `ereps`, `edesc`, `eimg` ) VALUES (?,?,?,?)";
  var query = db.query(
    sql,
    [ename, ereps, edesc, file.filename],
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: false,
          message: "failed to create exercise",
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "Successfully created exercise." });
    }
  );
});

//get all foods
app.get("/getexercise", (req, res) => {
  var sql = "select * from `exercise`";
  var query = db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: false,
        message: "failed to get",
      });
    }
    return res
      .status(200)
      .send({ message: "Successfully fetched.", status: true, data: result });
  });
});

app.listen(port, () => {
  console.log(`Fitness app listening at http://localhost:${port}`);
});
