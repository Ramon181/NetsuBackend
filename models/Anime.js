const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("anime", {
        name: {
            type: DataTypes.STRING
        },
        description:{
            type:DataTypes.TEXT
        },
        start_date: {
            type: DataTypes.INTEGER
        },
        end_date: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        image: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        }
    },
        {
            timestamps: false,
        })
}