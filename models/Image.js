const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("images", {
		url:{
			type:DataTypes.STRING,
			allowNull:false
		}

	},
  {
    timestamps: false,
  })
}