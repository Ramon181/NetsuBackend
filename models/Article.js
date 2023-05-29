const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("article", {
		article: {
			type:DataTypes.STRING,
			allowNull:false
		}
	},
  {
    timestamps: false,
  })
}