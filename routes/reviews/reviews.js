const { Router } = require("express");
const { Op } = require("sequelize");
const { User, Review } = require("../../index");

const router = Router()

////////////////////////////////////////Usuario/////////////////////////////////////////////////

router.post("/", async (req, res) => {
    const { postId, userName, parentId, icon, description } = req.body;
    try {
        const user = await User.findByPk(userName);

        if (user.mute) return res.status(400).send({ menssage: "Ha ocurrido un error al comentar" });
        const newReview = await Review.create({
            postId,
            userName,
            parentId,
            icon,
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
        const comments = await Review.findAll({
            where: {
                postId: id,
                parentId: null,
                hidden: false
            },
            include: [{ model: Review, as: 'replies' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(comments);

    } catch (error) {
        res.status(400).send({ message: "Ha ocurrido un error" });
    }
});

router.put("/like/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const comentario = await Review.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        comentario.likes += 1;
        await comentario.save();

        res.send(comentario);
    } catch (error) {
        res.status(400).send({ menssage: "Ha ocurrido un error" })
    }
});

router.put("/dislike/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const comentario = await Review.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        comentario.likes -= 1;
        await comentario.save();

        res.json(comentario);
    } catch (error) {
        res.status(400).json({ message: "Ha ocurrido un error" });
    }
});

router.put("/", async (req, res) => {
    const { id, userName, description, icon } = req.body;
    try {
        const comment = await Review.findByPk(id);

        if (!comment || comment.userName !== userName) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        await comment.update({
            description,
            icon
        });

        res.json({ message: "Comentario modificado correctamente." });
    } catch (error) {
        res.status(400).json({ message: "Ha ocurrido un error al modificar el comentario." });
    }
});

router.delete("/", async (req, res) => {
    const { id, userName } = req.body;
    try {
        // Buscar el comentario por su ID
        const comentario = await Review.findByPk(id);

        // Verificar si el comentario existe y pertenece al usuario
        if (!comentario || comentario.userName !== userName) {
            return res.status(404).json({ message: "Comentario no encontrado." });
        }

        // Eliminar el comentario
        await comentario.destroy();

        res.status(200).json({ message: "Comentario eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al eliminar el comentario." });
    }
});

////////////////////////////////////////Admin/////////////////////////////////////////////////

router.get("/all", async (req, res) => {
    const { userName } = req.body;
    let { search, amount, page } = req.query;
    if (!page) page = 0;
    if (!amount) amount = 10;
    if (!search) search = "";
    try {
        const userWithUserName = await User.findOne({ where: { userName } }).catch(
            (err) => {
                console.log("Error ", err);
            }
        );
        if (userWithUserName && userWithUserName.role === "admin") {
            const { count, rows: reviews } = await Review.findAndCount({
                offset: page * amount,
                limit: amount,
                where: {
                    userName: { [Op.iLike]: `%${search}%` }
                },
                order: [['createdAt', 'ASC']]
            });
            res.send({ count, reviews });
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" });
        }
    } catch (error) {
        res.status(400).send({ message: "Ha ocurrido un error" });
    }
});

router.put("/all/hidden", async (req, res) => {
    const { id, userName } = req.body;
    try {
        const userWithUserName = await User.findOne({ where: { userName } }).catch(
            (err) => {
                console.log("Error ", err);
            }
        );
        if (userWithUserName && userWithUserName.role === "admin") {
            const comment = await Review.findByPk(id);
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado.' });
            }

            comment.setHidden(true); // Oculta el comentario

            res.send(comment);
        } else {
            res.status(200).send({ message: "No se ha encontrado un administrador" });
        }
    } catch (error) {
        res.status(400).send({ message: "Ha ocurrido un error" });
    }
});

module.exports = router