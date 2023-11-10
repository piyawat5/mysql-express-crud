const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
//MAMP
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql_express",
  port: "3306",
});

connection.connect((err) => {
  if (err) {
    console.log("error connencting to MySQL", err);
  }
  console.log("MySQL successfully connected");
});

// CREATE ROUTES
app.post("/user/create", (req, res) => {
  const { name, email, password } = req.body;
  try {
    connection.query(
      "INSERT INTO users(email, fullname, password) VALUES(?,?,?)",
      [email, name, password],
      (err, results, fields) => {
        if (err) {
          console.log("ERROR while inserting a user into the database", err);
          return res.status(409).send();
        }
        return res
          .status(201)
          .json({ message: "New user successfully created" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//READ
app.get("/user", (req, res) => {
  try {
    connection.query("SELECT * FROM users", (err, result, fields) => {
      if (err) {
        res.status(400).send();
        return;
      }
      res.json(result);
    });
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//READ single users from db
app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "SELECT * FROM users WHERE users.id = ?",
      [id],
      (err, result, fields) => {
        if (err) {
          res.status(400).send();
          return;
        } else if (result.length < 1) {
          res.status(404).send();
          return;
        }
        res.json(result[0]);
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//UPDATE data
app.put("/user/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { password, fullname, email } = req.body;
  try {
    connection.query(
      "UPDATE users SET password = ?, fullname = ?, email = ? WHERE id = ?",
      [password, fullname, email, id],
      (err, result, fields) => {
        if (err) {
          res.status(400).send();
          return;
        }
        res.json({ message: "User updated successfully" });
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

//UPDATE data
app.delete("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      "DELETE FROM users WHERE users.id = ?",
      [id],
      (err, result, fields) => {
        if (err) {
          res.status(400).send();
          return;
        }
        if (result.affectedRows === 0) {
          res.status(404).json({ massage: "Not found user" });
          return;
        }
        res.json({ message: "User is deleted successfully" });
        return;
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(3000, () => console.log("port3000"));
