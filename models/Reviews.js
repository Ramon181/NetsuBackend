const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("review", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    icon: {
      type: DataTypes.STRING
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
}