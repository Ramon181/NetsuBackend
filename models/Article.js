const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("article", {
		text: {
			type: DataTypes.STRING,
			allowNull: false
		},
		article: {
			type: DataTypes.STRING,
			allowNull: false
		}

	},
		{
			timestamps: false,
		})
}