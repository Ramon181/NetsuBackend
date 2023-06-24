const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: "user",
        },
        banned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailToken: {
            type: DataTypes.TEXT,
        },
        resetToken: {
            type: DataTypes.TEXT,
        },
        resetTokenExpiration: {
            type: DataTypes.DATE
        },
        isSuperAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        profile: {
            type: DataTypes.STRING,
            defaultValue: "https://tinypic.host/images/2023/05/17/profile.png"
        }
    },
        {
            timestamps: false,
        }
    );
}