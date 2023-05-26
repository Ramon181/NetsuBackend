const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("personage", {
		id: {
			type:DataTypes.UUID,
			primaryKey:true,
			allowNull:false,
			defaultValue:DataTypes.UUIDV4
		},
		name: {
			type:DataTypes.STRING
		},
		description: {
			type:DataTypes.TEXT
		},
		age: {
			type:DataTypes.INTEGER
		},
		height:{
			type: DataTypes.INTEGER
		},
		weight:{
			type: DataTypes.INTEGER
		},
		state:{
			type:DataTypes.STRING
		},
		img:{
			type:DataTypes.STRING
		},
		race: {
			type:DataTypes.STRING
		},
	},
  {
    timestamps: false,
  })
}