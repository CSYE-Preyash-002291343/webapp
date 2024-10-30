const {Model, DataTypes} = require('sequelize');
require('dotenv').config();

class Image extends Model {
    static init(sequelize) {
        super.init({
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    filename : {
        type: DataTypes.STRING,
        allowNull: false
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false
    },
    upload_date : {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id : {
        type: DataTypes.UUID,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Image',
    timestamps: false,
});
}
}

// Function to save image details
async function saveImageDetails(imageDetails) {
    try {
        const image = await Image.create({
            filename: imageDetails.filename,
            url: imageDetails.url,
            user_id: imageDetails.userId,
            upload_date: new Date()
        });
        return image;
    } catch (error) {
        console.error('Error saving image details:', error);
        throw new Error('Failed to save image details.');
    }
}

module.exports = {
    Image, 
    saveImageDetails
};