const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql_express",
});

// CREATE ROUTES
app.post("/user/create", (req, res) => {
  const { name, email, password } = req.body;
  try {
    pool.query(
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

// READ
app.get("/user", (req, res) => {
  try {
    pool.query("SELECT * FROM users", (err, result, fields) => {
      if (err) {
        res.status(400).json({ message: err });
        return;
      }
      res.json(result);
    });
  } catch (error) {
    console.log(err);
    res.status(500).send();
  }
});

// READ single user from db
app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  try {
    pool.query(
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

// UPDATE data
app.put("/user/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { password, fullname, email } = req.body;
  try {
    pool.query(
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

// DELETE data
app.delete("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    pool.query(
      "DELETE FROM users WHERE users.id = ?",
      [id],
      (err, result, fields) => {
        if (err) {
          res.status(400).send();
          return;
        }
        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Not found user" });
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

app.listen(3000, () => console.log("port 3000"));
