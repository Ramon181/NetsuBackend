const { Router } = require("express");
const { Gender } = require("../../index.js");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name) {
      await Gender.create({ name, description });
      res.send("Gender created");
    } else {
      res.send("Gender No create");
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  let getGender = [
    "Action",
    "Adventure",
    "Comedy",
    "Fantasy",
    "Martial Arts",
    "Terror",
    "Drama",
    "Wick",
    "Love",
    "Suspense",
  ];

  getGender.forEach((e) => {
    Gender.findOrCreate({ where: { name: e } });
  });
  const allGender = await Gender.findAll();
  res.status(200).send(allGender);
});

router.put("/", async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (id) {
      const udateAbility = await Gender.update(
        { name, description },
        { where: { id } }
      );
      res.send(udateAbility);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/", async (req, res) => {
  try {
    const id = req.body.id;
    await Gender.destroy({ where: { id } });
    res.send("Ability deleted");
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
