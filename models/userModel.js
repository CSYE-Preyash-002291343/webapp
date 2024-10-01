const { Model, DataTypes} = require('sequelize');
require('dotenv').config();

class User extends Model {
    static init(sequelize) {
        super.init({
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_created : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    account_updated : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: false,
});
}
}

module.exports = User;