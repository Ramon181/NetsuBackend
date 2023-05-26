const { Router } = require("express");
const { Ability } = require("../../index.js");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name) {
      await Ability.create({ name, description });
      res.send("Ability created");
    } else {
      res.send("Ability No create");
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    res.send(await Ability.findAll());
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const {id, name, description } = req.body;
	if (id) {
		const udateAbility = await Ability.update({name, description},{where: {id}});
		res.send(udateAbility);
	}else{
		res.status(404).send("Not Found");
	}
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/", async (req, res) => {
	try {
		const id = req.body.id;
		await Ability.destroy({where: {id}});
		res.send("Ability deleted");
	} catch (error) {
		console.log(error.message);
	}
})

module.exports = router;
