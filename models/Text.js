const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("text", {
		description: {
			type:DataTypes.TEXT,
			allowNull:false
		},
	},
  {
    timestamps: false,
  })
}