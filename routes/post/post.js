const { Router } = require("express");
const { Post, Article, Serie } = require("../../index");

const router = Router();

router.post("/", async (req, res) => {
  const { title, description, img, textos, photos, serie } = req.body;
  try {
    const newPost = await Post.create({
      title,
      description,
      img,
    });

    const series = await Serie.findAll({
      where: { name: serie },
    });
    newPost.addSerie(series);

    const maxLength = Math.max(textos.length, photos.length);

    if (maxLength > 0) {
      for (let i = 0; i < maxLength; i++) {
        const texto = textos[i] || '';
        const photo = photos[i] || '';

        try {
          newPost.createArticle({ text: texto, article: photo });
        } catch (error) {
          res.status(400).send({ message: "Noe es aque" });
        }
      }
    } else {
      res.status(400).send({ message: "Hola es aqi" });
    }

    res.status(200).send(newPost)
  } catch (error) {
    res.status(500).send({ message: "no se pudo jsjsjjsjs" });
  }
});

router.get("/", async (req, res) => {
  const allPost = await Post.findAll({
    include: [
      {
        model: Article,
      },
      {
        model: Serie,
      },
    ],
  });
  res.status(200).send(allPost);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Article,
        },
        {
          model: Serie,
        },
      ],
    });
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ message: "Not Found" });
  }
});

module.exports = router;
