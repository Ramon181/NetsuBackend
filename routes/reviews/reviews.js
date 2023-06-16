const { Router } = require("express");
const { User, Review } = require("../../index");

const router = Router()

router.post("/", async (req, res) => {
    const { postId, userName, icon, stars, description } = req.body;
    try {
        const user = await User.findByPk(userName);

        if (user.mute) return res.status(400).send({ menssage: "Ha ocurrido un error al comentar" });
        const newReview = await Review.create({
            postId,
            userName,
            icon,
            stars,
            description
        })
        res.status(200).send(newReview)
    } catch (error) {
        res.status(400).send({ menssage: "Ha ocurrido un error al comentar" })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const revie = await Review.findAll({
            where: {
                postId: id,
                hidden: false,
            }
        })
        res.status(200).send(revie)

    } catch (error) {
        res.status(400).send({ menssage: "Ha ocurrido un error" })
    }
});

router.get("/", async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: {
                hidden: false,
            },
        });
        res.send(reviews);
    } catch (error) {
        res.status(400).send({ menssage: "Ha ocurrido un error" })
    }
});

router.put("/", async (req, res) => {
    const { postId, userName, description, stars, icon } = req.body;
    try {
        await Review.update(
            {
                userName,
                postId,
                description,
                stars,
                icon
            },
            {
                where: { postId, userName },
            }
        );
        res.send("Review modificada");
    } catch (error) {
        res.status(400).send({ menssage: "Ha ocurrido un error" })
    }
});

module.exports = router