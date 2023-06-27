const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("episode", {
        number: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        type: {
            type: DataTypes.STRING
        }
    },
        {
            timestamps: false,
        })
}
