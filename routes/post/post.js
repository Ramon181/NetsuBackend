const { Router } = require("express");
const { Post, Article, Text, Serie } = require("../../index");

const router = Router();

router.post("/", async (req, res) => {
  const { title, description, texts, photos, serieId } = req.body;
  try {
    const newPost = await Post.create({
      title,
      description,
      serieId,
    });

    if (texts.length > 0) {
      for (let text of texts) {
        try {
          newPost.createText({ text: text });
        } catch (error) {
          res.status(400).send({ message: "Not Found" });
        }
      }
    }

    if (photos.length > 0) {
      for (let photo of photos) {
        try {
          newPost.createArticle({ article: photo });
        } catch (error) {
          res.status(400).send({ message: "Not Found" });
        }
      }
    }
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
  } catch (error) {
    res.status(400).send({ message: "Not Found" });
  }
});

module.exports = router;
