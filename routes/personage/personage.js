const { Router } = require("express");
const { Personage, Ability, Image, Serie } = require("../../index.js");

const router = Router();

router.post("/", async (req, res) => {
  const {
    name,
    description,
    age,
    height,
    weight,
    state,
    race,
    img,
	serieId,
    photos,
    ability,
  } = req.body;
  try {
	//   console.log("name:" + name,"description:" +  description,"age:" + age,"height:" + height, "weight:" + weight, "serie:" + serie, "photos:" + photos, "ability:" + ability, "race:" + race, "img:" + img, )
    const newPersonage = await Personage.create({
      name,
      description,
      age,
      height,
      weight,
      state,  
      race,
      img,
	  serieId,
    });
    const abilities = await Ability.findAll({
      where: { name: ability },
    });
    newPersonage.addAbility(abilities);

	// const anime = await Serie.findAll({
	// 	where: { name: serie },
	//   });
    // newPersonage.addSerie(anime);

    if (photos.length > 0) {
      for (let photo of photos) {
        try {
          newPersonage.createImage({ image: photo });
        } catch (error) {
          res.status(400).send({ message: "no se pudo la imagen" });
        }
      }
    } else {
      res.status(400).send({ message: "This person" });
    }
    res.status(200).send(newPersonage);
  } catch (error) {
    res.status(400).send({ message: error.menssage });
  }
});

router.get("/", async (req, res) => {
  try {
    const personages = await Personage.findAll({
      include: [
        {
          model: Ability,
          through: { attributes: [] },
        },
		{
			model: Serie
		}
      ],
    });
    res.send(personages);
  } catch (error) {
    console.log(error.message);
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
      ],
    });
    res.send(personage);
  } catch (error) {
    console.log(error.menssage);
  }
});

module.exports = router;
