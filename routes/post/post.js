const { Router } = require("express");
const { Post, Article, Text, Serie } = require("../../index");

const router = Router();

router.post("/", async (req, res) => {
  const { title, description, textos, photos, serieId } = req.body;
  try {
    const newPost = await Post.create({
      title,
      description,
      serieId,
    });

    if (textos.length) {
      for (let texto of textos) {
        try {
          newPost.createText({ text: texto });
        } catch (error) {
          res.status(400).send({ message: "Noe es aque" });
        }
      }
    } else {
      res.status(400).send({ message: "Hola es aqi" });
    }

    if (photos.length) {
      for (let photo of photos) {
        try {
          newPost.createArticle({ article: photo });
        } catch (error) {
          res.status(400).send({ message: "Not Found" });
        }
      }
    } else {
      res.status(400).send({ message: "perra" });
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
        model: Text,
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
          model: Text,
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
