const { Router } = require("express");
const { Post, Article, Serie, Review } = require("../../index");

const router = Router();

////////////////////////////////////////Admin/////////////////////////////////////////////////

router.post("/", async (req, res) => {
  const { userName, title, description, img, textos, photos, serie } = req.body;
  try {
    const userWithUseName = await User.findOne({ where: { userName } });
    if (!userWithUseName || userWithUseName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }

    const newPost = await Post.create({
      title,
      description,
      img,
      likes: 0, // Inicializar los likes en 0
      visits: 0 // Inicializar las visitas en 0
    });

    const series = await Serie.findAll({
      where: { name: serie },
    });
    await newPost.setSeries(series);

    const maxLength = Math.max(textos.length, photos.length);

    if (maxLength > 0) {
      for (let i = 0; i < maxLength; i++) {
        const texto = textos[i] || '';
        const photo = photos[i] || '';

        try {
          await newPost.createArticle({ text: texto, article: photo });
        } catch (error) {
          console.log(error);
        }
      }
    }

    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al crear la publicación" });
  }
});

router.get("/all", async (req, res) => {
  const { userName } = req.body;
  let { search, amount, page } = req.query;
  if (!page) page = 0;
  if (!amount) amount = 10;
  if (!search) search = "";

  try {
    const userWithUserName = await User.findOne({ where: { userName } });

    if (!userWithUserName || userWithUserName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }

    const posts = await Post.findAndCountAll({
      offset: page * amount,
      limit: amount,
      where: {
        title: { [Op.iLike]: `%${search}%` }
      },
      include: [
        {
          model: Article,
        },
        {
          model: Serie,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al obtener las publicaciones" });
  }
});

router.put("/", async (req, res) => {
  const { id, userName, title, description, img, serie, textos, photos } = req.body;

  try {
    const userWithUserName = await User.findOne({ where: { userName } });
    if (!userWithUserName || userWithUserName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Actualizar los campos de la publicación
    post.title = title;
    post.description = description;
    post.img = img;

    // Actualizar la serie asociada a la publicación
    const series = await Serie.findAll({ where: { name: serie } });
    await post.setSeries(series);

    // Eliminar los artículos existentes de la publicación
    await post.setArticles([]);

    // Crear y asociar los nuevos artículos a la publicación
    const maxLength = Math.max(textos.length, photos.length);
    if (maxLength > 0) {
      for (let i = 0; i < maxLength; i++) {
        const texto = textos[i] || '';
        const photo = photos[i] || '';

        const article = await Article.create({ text: texto, article: photo });
        await post.addArticle(article);
      }
    }

    res.status(200).json({ message: "Publicación actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error al actualizar la publicación" });
  }
});

router.put("/all/hidden", async (req, res) => {
  const { id, userName } = req.body;
  try {
    const userWithUserName = await User.findOne({ where: { userName } });
    if (!userWithUserName || userWithUserName.role !== "admin") {
      return res.status(403).json({ message: "No se ha encontrado un administrador" });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    post.hidden = true; // Oculta la publicación
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ha ocurrido un error" });
  }
});


////////////////////////////////////////Usuario/////////////////////////////////////////////////

router.get("/recientes", async (req, res) => {
  let { search } = req.query;
  if (!search) search = "";
  try {
    const publicaciones = await Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      where: {
        title: { [Op.iLike]: `%${search}%` }
      },
      include: [
        {
          model: Article,
        },
        {
          model: Serie,
        },
      ],
    });
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al obtener las 10 primeras publicaciones más recientes.' });
  }
});

router.get("/vistas", async (req, res) => {
  let { search } = req.query;
  if (!search) search = "";
  try {
    const publicaciones = await Post.findAll({
      order: [['visitas', 'DESC']],
      limit: 10,
      where: {
        title: { [Op.iLike]: `%${search}%` }
      },
      include: [
        {
          model: Article,
        },
        {
          model: Serie,
        },
      ],
    });
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al obtener las 10 primeras publicaciones más visitadas.' });
  }
});

router.get("/populares", async (req, res) => {
  let { search } = req.query;
  if (!search) search = "";
  try {
    const publicaciones = await Post.findAll({
      order: [['likes', 'DESC']],
      limit: 10,
      where: {
        title: { [Op.iLike]: `%${search}%` }
      },
      include: [
        {
          model: Article,
        },
        {
          model: Serie,
        },
      ],
    });
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al obtener las 10 primeras publicaciones con más likes.' });
  }
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

router.put("/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }
    post.likes += 1;
    await post.save();
    res.status(200).json({ message: 'Like incrementado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al incrementar el like.' });
  }
});

router.put("/:id/visitas", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }
    post.visitas += 1;
    await post.save();
    res.status(200).json({ message: 'Visitas incrementadas correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error al incrementar las visitas.' });
  }
});

module.exports = router;
