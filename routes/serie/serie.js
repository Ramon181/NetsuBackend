const { Router } = require("express");
const { Op } = require("sequelize");
const { Gender, Serie, Post, User } = require("../../index");

const router = Router();

////////////////////////////////////////Admin/////////////////////////////////////////////////

router.post("/", async (req, res) => {
    const { userName, name, description, author, demography, country, img, gender } =
        req.body;
    try {
        const userWithUseName = await User.findOne({ where: { userName } }).catch(
            (err) => {
                res.status(400).send({Error: err.message});
            }
        );
        if (userWithUseName && userWithUseName.role === "admin") {
            const newSerie = await Serie.create({
                name, description, author, demography, country, img
            })
            const genderGet = await Gender.findAll({
                where: { name: gender }
            })
            newSerie.addGender(genderGet)
            res.status(200).send(newSerie)
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" })
        }

    } catch (error) {
        res.status(400).send({ message: "not found" })
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
            const series = await Serie.findAndCountAll({
                offset: page * amount,
                limit: amount,
                where: {
                    name: { [Op.iLike]: `%${search}%` }
                },
                include: [
                    {
                        model: Gender,
                        through: { attributes: [] },
                    },
                    {
                        model: Post
                    }
                ],
            })
            res.send(series);

        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" })
        }
    } catch (error) {
        res.status(400).send({ message: "not found" })
    }
});

router.put("/modify", async (req, res) => {
    const { id, userName, name, description, author, demography, country, img, gender } = req.body;
    try {
        const userWithUseName = await User.findOne({ where: { userName } }).catch(
            (err) => {
                console.log("Error ", err);
            }
        );
        if (userWithUseName && userWithUseName.role === "admin") {
            await Serie.update({ name, description, author, demography, country, img },
                {
                    where: { id: id }
                })
            const series = await Serie.findByPk(id);

            const genderGet = await Gender.findAll({
                where: { name: gender }
            })
            await series.setGenders(genderGet)

            res.status(200).send({ message: "Serie Actualizada" })

        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" })
        }

    } catch (error) {
        res.status(400).send({ message: "not found" })
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const { userName } = req.body
    try {
        const userWithUseName = await User.findOne({ where: { userName } }).catch(
            (err) => {
                console.log("Error ", err);
            }
        );
        if (userWithUseName && userWithUseName.role === "admin") {
            await Serie.destroy({ where: { id: id } })
            res.status(200).send({ message: "Serie Eliminada" })
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
});

////////////////////////////////////////Usuario/////////////////////////////////////////////////

router.get("/series", async (req, res) => {
    let { search, amount, page } = req.query;
    if (!page) page = 0;
    if (!amount) amount = 20;
    if (!search) search = "";
    try {
        const allSeries = await Serie.findAndCountAll({
            offset: page * amount,
            limit: amount,
            where: {
                name: { [Op.iLike]: `%${search}%` }
            },
            include: [
                {
                    model: Gender,
                    through: { attributes: [] },
                },
                {
                    model: Post
                }
            ]
        })
        res.status(200).send(allSeries)
    } catch (error) {
        res.status(400).send({ message: "Ha ocurrido un error" })
    }
});

router.get("/series/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const anime = await Serie.findByPk(id, {
            include: [
                {
                    model: Gender,
                    through: { attributes: [] },
                },
                {
                    model: Post
                }
            ]
        });
        res.status(200).send(anime)
    } catch (error) {
        res.status(400).send({ message: "Ha ocurrido un error" })
    }
})

module.exports = router;
