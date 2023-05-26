const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("ability", {
		name: {
			type:DataTypes.STRING,
			allowNull:false
		},
		description: {
			type:DataTypes.TEXT
		}
	},
  {
    timestamps: false,
  })
}