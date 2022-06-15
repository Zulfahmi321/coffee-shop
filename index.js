require("dotenv").config();
//1. inisialisasi package express dengan nama variabelnya bebas
const express = require("express");

// daftarkan router
const mainRouter = require("./src/routes/index");

//input

//import config db
const db = require("./src/config/db");

// const logger = require("morgan");

//2. create aplikasi express
const server = express();

//untuk menjalankan di local maka mendefinisikan port localnya
const PORT = process.env.PORT || 8080;

// CORS

const cors = require("cors");
//pengkondisian koneksi db berhasil, maka jalankan local server
db.connect()
    .then(() => {
        console.log("DB Connected");

        // logger
        // server.use(
        //     logger(":method :url :status :res[content-length] - :response-time ms")
        // );

        //pasang middleware global
        //handler untuk body berbentuk form urlencoded
        server.use(express.urlencoded({ extended: false }));

        //handler untuk body berbentuk raw json
        server.use(express.json());

        //untuk melihat gambar di postman
        server.use(express.static("public"));

        // pasang cors
        const corsOptions = {
            origin: ["http://127.0.0.1:5500", "http://localhost:3000", "https://coffee-shop-zul.herokuapp.com"],
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
          };
          server.use(cors(corsOptions));
          // server.options("*", cors(corsOptions));

        //pasang router ke server
        server.use(mainRouter);

        server.listen(PORT, () => {
            console.log(`Server Is Running On Port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

