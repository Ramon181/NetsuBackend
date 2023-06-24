const { Router } = require("express");
const { User } = require("../../index");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const router = Router();

////////////////////////////////////////Usuario/////////////////////////////////////////////////

// crear usuario y enviar token para verificar correo

router.post("/register", async (req, res) => {
  const { userName, email, password, name, role, profile } = req.body;

  const alreadyExistUserEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error ", err);
    }
  );

  const alreadyExistUserName = await User.findOne({
    where: { userName },
  }).catch((err) => {
    console.log("Error ", err);
  });

  if (alreadyExistUserEmail) {
    return res.json({ message: "User with email already exists!" });
  }
  if (alreadyExistUserName) {
    return res.json({ message: "User with user Name already exists!" });
  }
  if (!password) {
    return res.json({ message: "enter a password!" });
  }
  if (password.length < 4) {
    return res.json({ message: "password must have more than 4 characters!" });
  }
  // Comprueba si el rol es "admin" y devuelve un mensaje de error
  if (role === "admin") {
    return res.json({ message: "No se puede crear un usuario con rol de administrador" });
  }

  const emailToken = crypto.randomBytes(64).toString("hex");

  const newUser = new User({
    userName,
    email,
    password,
    name,
    role,
    banned: false,
    emailToken,
    emailVerified: false,
    profile,
  });
  const saveUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.json({ error: "Cannot register user at the moment!" });
  });

  const verificationLink = `http://${req.headers.host}/user/verify-email/${emailToken}`;

  const mailOptions = {
    from: 'Bienvenido a Mi Blog',
    to: newUser.email,
    subject: 'Verificación de correo electrónico',
    text: 'Por favor, verifique su correo electrónico haciendo clic en el siguiente enlace:',
    html: `<p>Por favor, verifique su correo electrónico haciendo clic en el siguiente enlace:</p>
    <a href="${verificationLink}">Verificar correo electrónico</a>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico de verificación enviado:', info.response);
    }
  });

  if (saveUser) {
    const jwtToken = jwt.sign({ userName }, process.env.JWT_SECRET);
    res.json({
      userName,
      name,
      token: jwtToken,
      role: role,
      banned: false,
      profile: profile,
    });
  }
});

// recibir el token para verificar el correo

router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Buscar el usuario correspondiente al token de verificación
    const user = await User.findOne({ where: { emailToken: token } });

    if (!user) {
      return res.status(404).json({ message: "Token de verificación no válido" });
    }

    // Verificar si el correo electrónico ya ha sido verificado
    if (user.emailVerified) {
      // Redirigir al usuario a una página de éxito o mostrar un mensaje informativo
      return res.redirect("http://localhost:5173/success");
    }

    // Actualizar el campo emailVerified a true y borrar el token de verificación
    user.emailVerified = true;
    user.emailToken = null;
    await user.save();

    // Redirigir al usuario a una página de éxito o mostrar un mensaje informativo
    res.redirect("http://localhost:5173/success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al verificar el correo electrónico" });
  }
});

// iniciar session con el usuario y la contraseña

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const userWithUseName = await User.findOne({ where: { userName } }).catch(
    (err) => {
      console.log("Error ", err);
    }
  );

  if (!userWithUseName) {
    return res
      .status(404)
      .json({ message: "User name or password does not match!" });
  }
  if (userWithUseName.password !== password) {
    return res
      .status(404)
      .json({ message: "User name or password does not match!" });
  }

  const jwtToken = jwt.sign(
    { userName: userWithUseName.userName },
    process.env.JWT_SECRET
  );

  res.json({
    userName,
    name: userWithUseName.name,
    role: userWithUseName.role,
    profile: userWithUseName.profile,
    banned: userWithUseName.banned,
    token: jwtToken,
  });
});

// enviar el token para cambiar la contraseña

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // Verifica si el usuario existe en la base de datos
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Caduca en 1 hora
    await user.save();

    const resetLink = `http://http://localhost:5173/reset-password/${user.userName}/${token}`;

    const mailOptions = {
      from: "technotrade2022g5@gmail.com",
      to: oldUser.email,
      subject: "Restaura tu contraseña",
      html: `
      <h4>Hola ${oldUser.userName} </h4>
      <p>¿Olvidaste tu contraseña?</p>
      <p>Recibimos una solicitud para restaurar tu contraseña, haz click en el siguiente enlace</p>
      <p>${link}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mensaje enviado" + info.response);
      }
    });

    res.json({ message: "Se ha enviado un correo electrónico con el enlace para restablecer la contraseña" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al procesar la solicitud de cambio de contraseña" });
  }
});

// recibir el token para cambiar de contraseña

router.put("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Busca al usuario por el token de restablecimiento de contraseña
    const user = await User.findOne({
      where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } },
    });

    if (!user) {
      return res.status(400).json({ message: "El enlace para restablecer la contraseña es inválido o ha expirado" });
    }

    // Genera una nueva contraseña hasheada
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualiza la contraseña del usuario y elimina el token de restablecimiento
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.json({ message: "La contraseña se ha restablecido correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al restablecer la contraseña" });
  }
});

// ver con detalle el usuario

router.get("/user/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Retornar los detalles del usuario
    const userDetails = {
      name: user.name,
      userName: user.userName,
      profile: user.profile,
      email: user.email,
      password: user.password,
      roles: user.roles,
      banned: user.banned,
      // Agrega más campos según tus necesidades
    };

    res.json(userDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al obtener los detalles del usuario" });
  }
});

//actualizar el usuario

router.put("/profile", async (req, res) => {
  const { userName, name, profileImage } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los campos del perfil del usuario
    user.name = name;
    user.profile = profileImage;

    // Guardar los cambios en la base de datos
    await user.save();

    res.json({ message: "Perfil actualizado exitosamente", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al actualizar el perfil del usuario" });
  }
});


////////////////////////////////////////Admin/////////////////////////////////////////////////

// registrar un usuario administrador

router.post("/admin/register", async (req, res) => {
  const { superAdmin, userName, email, password, name, role, banned, profile } = req.body;

  const userWithUserName = await User.findOne({ where: { userName: superAdmin } }).catch(
    (err) => {
      console.log("Error ", err);
    }
  );

  if (!userWithUserName || !userWithUserName.isSuperAdmin) {
    return res.status(403).json({ message: "No se ha encontrado un superadministrador" });
  }

  const alreadyExistUserEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error ", err);
    }
  );

  const alreadyExistUserName = await User.findOne({
    where: { userName },
  }).catch((err) => {
    console.log("Error ", err);
  });

  if (alreadyExistUserEmail) {
    return res.json({ message: "User with email already exists!" });
  }
  if (alreadyExistUserName) {
    return res.json({ message: "User with user Name already exists!" });
  }
  if (!password) {
    return res.json({ message: "enter a password!" });
  }
  if (password.length < 4) {
    return res.json({ message: "password must have more than 4 characters!" });
  }

  const newUser = new User({
    userName,
    email,
    password,
    name,
    role,
    banned: false,
    profile,
  });
  const saveUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.json({ error: "Cannot register user at the moment!" });
  });

  if (saveUser) {
    const jwtToken = jwt.sign({ userName }, process.env.JWT_SECRET);
    res.json({
      userName,
      name,
      token: jwtToken,
      role: role,
      banned: false,
      profile: profile,
    });
  }
});

// ver todos los usuarios

router.get("/users", async (req, res) => {
  const { userName } = req.body;
  let { search, amount, page } = req.query;
  if (!page) page = 0;
  if (!amount) amount = 10;
  if (!search) search = "";

  try {
    const userWithUserName = await User.findOne({ where: { userName } });

    if (!userWithUserName || userWithUserName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }

    const users = await User.findAndCountAll({
      offset: page * amount,
      limit: amount,
      where: {
        userName: { [Op.iLike]: `%${search}%` },
        isSuperAdmin: false,
      },
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al obtener los usuarios" });
  }
});

// bannear un usuario

router.put("/ban/:id", async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body

  try {
    const userWithUserName = await User.findOne({ where: { userName } });

    if (!userWithUserName || userWithUserName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.banned = true;
    await user.save();

    res.json({ message: "Usuario baneado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al banear al usuario." });
  }
});


module.exports = router;