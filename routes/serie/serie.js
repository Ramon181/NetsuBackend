const { Router } = require("express");
const { Gender, Serie,Post } = require("../../index");

const router = Router();

router.post("/",async (req, res) => {
  const { name, description, author, demography, country, img, gender } =
    req.body;
    try {
            const newSerie = await Serie.create({
                name, description, author, demography, country, img
            })
            const genderGet = await Gender.findAll({
                where: { name: gender}
            })
            newSerie.addGender(genderGet)
            res.status(200).send(newSerie)
    
        // res.status(400).send({ message: "not found"})
    } catch (error) {
        res.status(400).send({ message: "not found"})
    }
});

router.get("/", async (req, res)=>{
	try {
        const series = await Serie.findAll({
            include: [
                {
                    model: Gender,
                    through: { attributes: [] },
                },
                {
                    model:Post
                }
            ],
        })
        res.send(series);
    } catch (error) {
        req.status(400).send({message: "not found"})
    }
})

module.exports = router;
