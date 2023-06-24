const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      img: {
        type: DataTypes.STRING
      },
      visit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );
};
