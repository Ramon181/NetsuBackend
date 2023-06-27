const { Router } = require("express");
const { Op } = require("sequelize");
const { Gender, Serie, Post, User, Anime, Episode } = require("../../index");

const router = Router();

////////////////////////////////////////Admin/////////////////////////////////////////////////

router.post("/", async (req, res) => {
    const { userName, name, description, author, img, portada, fondo, gender, animes } =
        req.body;

    try {
        const userWithUserName = await User.findOne({ where: { userName } });

        if (userWithUserName && userWithUserName.role === "admin") {
            const newSerie = await Serie.create({
                name,
                description,
                author,
                img,
                portada,
                fondo,
            });

            const genderGet = await Gender.findAll({ where: { name: gender } });
            await newSerie.addGender(genderGet);

            if (animes.length > 0) {
                for (let anime of animes) {
                    try {
                        console.log(anime)
                        const createAnime = await Anime.create(anime);
                        const episodes = await Episode.bulkCreate(anime.episodes);
                        await createAnime.addEpisodes(episodes)

                        await newSerie.addAnime(createAnime);
                    } catch (error) {
                        Error.captureStackTrace(error)
                    }
                }
            }
            res.status(200).send(newSerie);
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" });
        }
    } catch (error) {
        res.status(400).send({ message: "not found" });
    }
});

router.get("/episodes", async (req, res) => {
    const series = await Episode.findAll({
        include: [
            {
                model: Anime
            }
        ]
    })
    res.status(200).send(series)
})


router.get("/serie", async (req, res) => {
    const series = await Anime.findAll({
        include: [
            {
                model: Episode
            }
        ]
    })
    res.status(200).send(series)
})

router.get("/all", async (req, res) => {
    let { search, amount, page, userName } = req.query;
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
                        model: Anime,
                        include: [Episode],
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
    const { id, userName, name, description, author, img, portada, fondo, gender, animes } = req.body;

    try {
        const userWithUserName = await User.findOne({ where: { userName } });

        if (userWithUserName && userWithUserName.role === "admin") {
            await Serie.update({ name, description, author, portada, fondo, img }, { where: { id: id } });

            const series = await Serie.findByPk(id);

            if (animes.length > 0) {
                for (let anime of animes) {
                    try {
                        const existingAnime = await Anime.findByPk(anime.id);

                        if (existingAnime) {
                            // Actualizar anime existente
                            await existingAnime.update(anime);
                        } else {
                            // Crear nuevo anime
                            const createdAnime = await Anime.create(anime);
                            await series.addAnime(createdAnime);
                        }

                        if (anime.episodes.length > 0) {
                            for (let episode of anime.episodes) {
                                if (episode.id) {
                                    // Actualizar episodio existente
                                    const existingEpisode = await Episode.findByPk(episode.id);
                                    if (existingEpisode) {
                                        await existingEpisode.update(episode);
                                    }
                                } else {
                                    // Crear nuevo episodio
                                    const createdEpisode = await Episode.create(episode);
                                    await existingAnime.addEpisode(createdEpisode);
                                }
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            const genderGet = await Gender.findAll({ where: { name: gender } });
            await series.setGenders(genderGet);

            res.status(200).send({ message: "Serie Actualizada" });
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" });
        }
    } catch (error) {
        res.status(400).send({ message: "not found" });
    }
});



router.delete("/:userName/:id", async (req, res) => {
    const { userName, id } = req.params
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
                    model: Anime,
                    include: [Episode],
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
