const {Router} = require("express");
const {Personage, Ability} = require("../../index.js")

const router = Router();


router.post("/", async (req, res) => {
	const {name, description, age, species, img, ability} = req.body
	try{
		const newPersonage = await Personage.create({
			name, description, age, species, img
		})
		const abilities = await Ability.findAll({
			where: {name: ability}
		});
		newPersonage.addAbility(abilities);
		res.send(newPersonage)
	}catch (error){
		console.log(error.menssage)
	}
})

router.get("/", async (req, res)=>{
	try {
        const personages = await Personage.findAll({
            include: [
                {
                    model: Ability,
                    through: { attributes: [] },
                },
            ],
        })
        res.send(personages);
    } catch (error) {
        console.log(error.message)
    }
})

router.get("/:id", async (req, res)=>{
	const {id} = req.params
	try{
		const personage = await Personage.findByPk(id,{
			include:[
			  {
			  	model: Ability,
			  	through:{attributes:[]},
			  },
			  ]
		})
		res.send(personage)
	}catch(error){
		console.log(error.menssage)
	}
})

module.exports = router;