const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("image_post", {
		url: {
			type:DataTypes.STRING,
			allowNull:false
		}
	},
  {
    timestamps: false,
  })
}