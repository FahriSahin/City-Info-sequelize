const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Role = sequelize.define("role" , {
    role_name :{
        type : DataTypes.STRING,
        allowNull : false 
    }
})

module.exports = Role;