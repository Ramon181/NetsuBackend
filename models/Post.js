const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("post", {
		front_page: {
			type:DataTypes.STRING,
			allowNull:false
		},
        description:{
            type:DataTypes.TEXT,
        }
	},
  {
    timestamps: false,
  })
}