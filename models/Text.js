const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("text", {
		text: {
			type:DataTypes.TEXT,
			allowNull:false
		},
	},
  {
    timestamps: false,
  })
}