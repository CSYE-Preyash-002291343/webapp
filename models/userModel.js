const { Model, DataTypes} = require('sequelize');
require('dotenv').config();
const crypto = require('crypto');

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
    },
    verificationToken : {
        type: DataTypes.STRING
    },
    verificationTokenExpires : {
        type: DataTypes.DATE
    },
    verificationStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: false,
    hooks: {
        beforeCreate: (user) => {
            user.verificationToken = crypto.randomBytes(20).toString('hex'); 
            user.verificationTokenExpires = new Date(Date.now() + 2 * 60 * 1000); 
        }
    },
});
}
}

module.exports = User;