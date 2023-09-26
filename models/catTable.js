const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Category = sequelize.define("Category" , {
    category_name2 :{
        type : DataTypes.STRING,
        allowNull : false 
    },
    url :{
        type : DataTypes.STRING,
        allowNull : false 
    }
})

module.exports = Category;