const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const User = sequelize.define("user" , {
    fullName : {
        type : DataTypes.STRING,
        allowNull : false,
        validate:{
            notNull: {
                msg: 'Please enter your full name'
              } 
        }
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
        validate:{
            notNull: {
                msg: 'Please enter your password'
              } 
        }
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        validate:{
            notNull: {
                msg: 'Please enter your email'
              },
           isEmail : {
                msg : "email girmelisiniz"
           }   
        }

    }
})

module.exports = User;