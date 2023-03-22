import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { client } from "./db.js";


import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());



import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// ROUTE TANPA TOKEN

// dapatkan token
app.post("/api/login", async (req, res) => {
  const results = await client.query(
    `SELECT * FROM mahasiswa WHERE nim = '${req.body.nim}'`
  );
  // console.log(results.fields[0].dataTypeSize);
  if (results.rows.length > 0) {
    if (req.body.password === results.rows[0].password) {
      const token = jwt.sign(results.rows[0], process.env.SECRET_KEY);
      res.send(token);
      res.cookie("token", token);
      res.cookie("token", token);
      res.send("Login berhasil.");
    } else {
      res.status(401);
      res.send("Kata sandi salah.");
    }
  } else {
    res.status(401);
    res.send("Mahasiswa tidak ditemukan.");
  }
});

// MIDDLEWARE


//dapatkan token
app.post("/api/token", ()=>{
  const token = jwt.sign({
    id: 1,
    nama:"romi"
  }, process.env.SECRET_KEY);

  res.send(token);
  
  });
 
  // MIDDLEWARE
app.use((req, res, next) => {
  console.log(req.cookies.lo);
  if (req.headers.authorization === "Bearer abcd") {
    next();
  if (req.cookies.token) {
    try {
      jwt.verify(req.cookies.token, process.env.SECRET_KEY);
      next();
    } catch (err) {
      res.status(401);
      res.send("Anda harus login lagi.");
    }

  } else {
    res.status(401);
    res.send("Anda harus login terlebih dahulu.");
  
  }
}
  });

// dapatkan mahasiswa yang login
app.get("/api/me", (req, res) => {
  const me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
  res.json(me);
});

// ROUTE MAHASISWA


// tampilkan semua
app.get("/api/mahasiswa", async (_req, res) => {
  const results = await client.query("SELECT * FROM mahasiswa");
  res.json(results.rows);
});

// tampilkan satu
app.get("/api/mahasiswa/:id", async (req, res) => {
  const results = await client.query(
    `SELECT * FROM mahasiswa WHERE id = ${req.params.id}`
  );
  res.json(results.rows[0]);
});

// tambah
app.post("/api/mahasiswa", async (req, res) => {
  await client.query(
    `INSERT INTO mahasiswa (nim, nama) VALUES ('${req.body.nim}', '${req.body.nama}')`
  );
  res.send("Mahasiswa berhasil ditambahkan.");
});

// edit
app.put("/api/mahasiswa/:id", async (req, res) => {
  await client.query(
    `UPDATE mahasiswa SET nim = '${req.body.nim}', nama = '${req.body.nama}' WHERE id = ${req.params.id}`
  );
  res.send("Mahasiswa berhasil diedit.");
});

// hapus
app.delete("/api/mahasiswa/:id", async (req, res) => {
  await client.query(`DELETE FROM mahasiswa WHERE id = ${req.params.id}`);
  res.send("Mahasiswa berhasil dihapus.");
});

// ROUTE PELATIHAN

app.get("/api/pelatihan", async (_req, res) => {
  const results = await client.query("SELECT * FROM pelatihan");
  res.json(results.rows);
});

app.listen(3000, () => {
  console.log("Server berhasil berjalan.");
});

//dapatkan mahasiswa yang login
app.get("/api/me", (req,res)=>{
      const me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
});
