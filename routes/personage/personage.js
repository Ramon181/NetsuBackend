const { Router } = require("express");
const { Op } = require("sequelize");
const { Personage, Ability, Image, Serie, User } = require("../../index.js");
const { use } = require("passport");

const router = Router();

////////////////////////////////////////Admin/////////////////////////////////////////////////

router.post("/", async (req, res) => {
  const { userName, name, description, age, height, weight, state, race, img, serieId, photos, ability,
  } = req.body;
  try {
    //   console.log("name:" + name,"description:" +  description,"age:" + age,"height:" + height, "weight:" + weight, "serie:" + serie, "photos:" + photos, "ability:" + ability, "race:" + race, "img:" + img, )
    const userWithUseName = await User.findOne({ where: { userName } }).catch(
      (err) => {
        console.log("Error ", err);
      }
    );
    if (userWithUseName && userWithUseName.role === "admin") {
      const newPersonage = await Personage.create(
        {
          name, description, age, height, weight, state, race, img, serieId,
        });
      const abilities = await Ability.findAll({
        where: { name: ability },
      });
      newPersonage.addAbility(abilities);

      if (photos.length > 0) {
        for (let photo of photos) {
          try {
            newPersonage.createImage({ image: photo });
          } catch (error) {
            res.status(400).send({ message: "no se pudo la imagen" });
          }
        }
      }
      res.status(200).send(newPersonage);
    } else {
      res.status(200).send({ message: "No se ha encontrado un administrador" })
    }
  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});

router.get("/all", async (req, res) => {
  const { userName } = req.body;
  let { search, amount, page } = req.query;
  if (!page) page = 0;
  if (!amount) amount = 10;
  if (!search) search = "";
  try {
    const userWithUseName = await User.findOne({ where: { userName } }).catch(
      (err) => {
        console.log("Error ", err);
      }
    );
    if (userWithUseName && userWithUseName.role === "admin") {
      const personages = await Personage.findAndCountAll({
        offset: page * amount,
        limit: amount,
        where: {
          name: { [Op.iLike]: `%${search}%` }
        },
        include: [
          {
            model: Ability,
            through: { attributes: [] },
          },
          {
            model: Image,
          },
          {
            model: Serie,
          },
        ],
      });
      res.status(200).send(personages);
    } else {
      res.status(200).send({ message: "No se ha encontrado un administrador" })
    }
  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});



router.put("/", async (req, res) => {
  const { id, userName, name, description, age, height, weight, state, race, img, serieId, photos, ability,
  } = req.body;
  try {
    const userWithUseName = await User.findOne({ where: { userName } }).catch(
      (err) => {
        console.log("Error ", err);
      }
    );
    if (userWithUseName && userWithUseName.role === "admin") {

      Personage.update({
        name, description, age, height, weight, state, race, img, serieId,
      }, { where: { id: id } });

      const pers = await Personage.findByPk(id);


      const abilities = await Ability.findAll({
        where: { name: ability },
      });
      await pers.setAbilities(abilities);

      await pers.setImages([]);
      if (photos.length) {
        for (let photo of photos) {
          try {
            pers.createImage({ image: photo });
          } catch (error) {
            res.status(400).send({ message: "no se pudo la imagen" });
          }
        }
      } else {
        res.status(400).send({ message: "This person" });
      }
      res.status(200).send({ message: "Se ha actualizado correctamente" });
    } else {
      res.status(200).send({ message: "No se ha encontrado un administrador" })
    }
  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;
  try {
    const userWithUseName = await User.findOne({ where: { userName } }).catch(
      (err) => {
        console.log("Error ", err);
      }
    );
    if (userWithUseName && userWithUseName.role === "admin") {
      await Personage.destroy({ where: { id: id } })
      res.status(200).send({ message: "Personaje Eliminado" })
    } else {
      res.status(200).send({ message: "No se ha encontrado un administrador" })
    }

  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});

////////////////////////////////////////Usuario/////////////////////////////////////////////////

router.get("/", async (req, res) => {
  let { search, amount, page } = req.query;
  if (!page) page = 0;
  if (!amount) amount = 20;
  if (!search) search = "";
  try {
    const allPersonajes = await Personage.findAndCountAll({
      offset: page * amount,
      limit: amount,
      where: {
        name: { [Op.iLike]: `%${search}%` }
      },
      include: [
        {
          model: Ability,
          through: { attributes: [] },
        },
        {
          model: Image,
        },
        {
          model: Serie,
        },
      ],
    })
    res.status(200).send(allPersonajes)
  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const personage = await Personage.findByPk(id, {
      include: [
        {
          model: Ability,
          through: { attributes: [] },
        },
        {
          model: Image,
        },
        {
          model: Serie,
        },
      ],
    });
    res.status(200).send(personage);
  } catch (error) {
    res.status(400).send({ message: "Ha ocurrido un error" })
  }
});



module.exports = router;
