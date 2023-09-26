const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Blog = sequelize.define("blog" , {
   
    city_name : {
        type : DataTypes.STRING ,
        allowNull : false
    },
    url : {
        type : DataTypes.STRING ,
        allowNull : false
    },
    city_desc : {
        type : DataTypes.STRING,
        allowNull : false
    },
    city_budget : {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    imgurl:{
        type : DataTypes.TEXT,
        allowNull : false
    },
    city_long_desc : {
        type : DataTypes.TEXT,
    }
})

module.exports = Blog;
