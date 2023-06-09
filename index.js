require("dotenv").config()
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require('path');

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/netsudb`, {
	logging: false,
	native: false
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
	.filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Ability, Personage, User, Review, Post, Gender, Image, Serie, Article, Anime, Episode } = sequelize.models;


// Serie

Serie.belongsToMany(Gender, {
	through: "SerieGender",
	timestamps: false
})
Gender.belongsToMany(Serie, {
	through: "SerieGender",
	timestamps: false
});

Anime.hasMany(Episode);

Episode.belongsTo(Anime);

Anime.belongsTo(Serie);

Serie.hasMany(Anime);

// Personage

Personage.hasMany(Image)
Image.belongsTo(Personage)

Serie.hasMany(Personage)
Personage.belongsTo(Serie)

Personage.belongsToMany(Ability, {
	through: "PesonageAbility",
	timestamps: false
})
Ability.belongsToMany(Personage, {
	through: "PesonageAbility",
	timestamps: false
})

// Post

Post.hasMany(Article);
Article.belongsTo(Post);

Serie.belongsToMany(Post, {
	through: "PostSerie",
	timestamps: false
})
Post.belongsToMany(Serie, {
	through: "PostSerie",
	timestamps: false
})

// comentarios

User.belongsToMany(Post, {
	through: Review,
	foreignKey: "userName",
	otherKey: "postId",
});
Post.belongsToMany(User, {
	through: Review,
	foreignKey: "postId",
	otherKey: "userName",
});

Post.hasMany(Review);
Review.belongsTo(Post);

Review.hasMany(Review, {
	as: 'replies',
	foreignKey: 'parentId'
});

Review.belongsTo(Review, {
	as: 'parent',
	foreignKey: 'parentId'
});





module.exports = {
	...sequelize.models,
	db: sequelize
}

