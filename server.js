const express = require("express");
const {db, User} = require("./index.js");
const cors = require("cors");
const routes = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
require("./auth/passport")


const server = express()

server.use(express.urlencoded({extended:true}));
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

db.sync({force:true}).then(()=>{
    server.listen(port,()=>{
        console.log(`%s listening at ${port}`);
    })
})
.then(()=>{
  superAdmin("12345")
})

const superAdmin = async (password)=>{
  await User.findOrCreate({
    where: { userName: "ryan181" },
    defaults: {
      userName: "ryan181",
      name:"ryan",
      email: "null@null.null",
      password: password,
    },
  })
}