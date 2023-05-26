const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("serie", {
		id: {
			type:DataTypes.UUID,
			primaryKey:true,
			allowNull:false,
			defaultValue:DataTypes.UUIDV4
		},
		name: {
			type:DataTypes.STRING,
			allowNull:false
		},
		description: {
			type:DataTypes.TEXT
		},
        author: {
			type:DataTypes.STRING
		},
		demography: {
			type:DataTypes.STRING
		},
        country:{
            type:DataTypes.STRING
        },
		img:{
			type:DataTypes.STRING
		}
	},
  {
    timestamps: false,
  })
}