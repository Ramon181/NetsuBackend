const express = require("express");
const { db, User } = require("./index.js");
const cors = require("cors");
const routes = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require('bcrypt');
require("./auth/passport")


const server = express()

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet());
server.use(morgan('dev'));
server.use(
  cors({
    origin: "http://localhost:5173"
  })
);

server.use(express.json())
server.use("/", routes)

const port = 3001

db.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log(`%s listening at ${port}`);
  })
}).then(() => {
  createSuperAdmin();
});

const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ where: { isSuperAdmin: true } });

    if (existingSuperAdmin) {
      console.log('Superadmin already exists');
      return;
    }

    // Genera una contraseña segura para el superadmin
    const saltRounds = 10;
    const password = '12345'; // Cambia la contraseña por una segura
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crea el usuario superadmin en la base de datos
    await User.create({
      userName: 'luciano',
      password: hashedPassword,
      isSuperAdmin: true,
      email:"lucian@gmail.com",
      name:"luciano", 
      role:"admin"
    });
    console.log('Superadmin created successfully');
  } catch (error) {
    console.error('Error creating superadmin:', error);
  }
};