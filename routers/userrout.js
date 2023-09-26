const express = require("express");
const router = express.Router();
const bcyrpt = require("bcrypt");
const fs = require('fs')
const User = require("../models/UserModel");
const Role = require("../models/role");
const transporter = require("../database/sendMail");

  router.post("/userList" , async (req , res) => {
   const options = req.body.userradio
   const [newRole , id] = options.split(" ");
   if (newRole == "admin") {
    var role = 1
   }
   else if(newRole == "guest"){
    var role = 2
   }
   else{
    var role = 3
   }

   try {
      const user = await User.findOne({where : {id : id}});
      await user.setRoles([]);
      await user.addRole(role);
      await user.save()
      res.redirect("/account/userList")
   } catch (err) {
      console.log(err);
   }
  })

  router.use("/userList/delete/:id" , async (req , res) =>{
    const id = req.params.id;
    try{
       await User.destroy({
        where: {
          id : id
        }
      })
      res.redirect("/account/userList");
    }
      catch(err){
        console.log(err)
      }
  })

  router.post("/login"  , async (req,res) => {
    const password = req.body.password;
    const email = req.body.email;
    try{
      const user = await User.findOne({
        where : {
          email : email 
        },
        include : {
          model : Role ,
          attributes : ["role_name"],
        }
      });
      if (!user) {
        res.render("../authPages/login" , {alertMessage : "Email Bilgisi Hatalı"})
      }
      else{
        const match = await bcyrpt.compare(password , user.password);
        if (match){
          if (!user.roles[0]) {
            req.session.roleType = "guest"
          }
          else if(user.roles[0].role_name == "admin"){
            req.session.roleType = "admin"
          }
          else if(user.roles[0].role_name == "mod"){
            req.session.roleType = "mod"
          }

          req.session.isAuth = 1;
          res.redirect("/");
        }
        else{
          res.render("../authPages/login" , {alertMessage : "Şifre Bilgisi Hatalı"})
        }
      }
    }
    catch(err){
      console.log(err);
    }
    
  })

  router.use("/permisson" , (req , res) =>{
    res.render("../authPages/permisson");
  })

 

  router.use("/login"  ,(req ,res) => {
    res.render("../authPages/login");
  })

  router.use("/logout"  ,async (req , res) => {
    await req.session.destroy();
    res.redirect("/");
  })

  router.post("/res-pass"  , async (req , res) =>{
    const code = req.body.code;
    const newPass = req.body.pass;
    const hashedPassword = await bcyrpt.hash(newPass , 10);
    try{
      if (code == req.session.randomKey) {
         await User.update({password : hashedPassword },{
          where:{
            email : req.session.emailRes
          }
        })
        delete req.session.emailRes
        delete req.session.randomKey
        res.redirect("/account/login")
      }
    }
    catch(err){
      console.log(err);
    }
  })
  router.use("/res-pass" , async(req , res) =>{
    res.render("../authPages/mailYenile.ejs")
  })

  router.post("/reset-password"  , async (req , res) =>{
    const email = req.body.email;
    
    try{
      const user = await User.findOne({
        where : {
          email : email,
        }
      })
      if (user){
        req.session.emailRes = email;
        req.session.randomKey = Math.floor(Math.random()*900000 + 99999);

        transporter.sendMail({
          from:"55fahrisahin55@gmail.com",
          to : email ,
          subject : "Şifre Sıfırlama Talebi",
          text : `6 Haneli Doğrulama Kodu: ${req.session.randomKey} Bu kodu siz istemediyseniz, lütfen hesabınızı güvende tutmak için derhal bizimle iletişime geçin.`
        })
        res.redirect("/account/res-pass");
      }
      else{
        req.session.messageRes = "Bu mailde kullanıcı yok";
        res.redirect("/account/reset-password");
      }
    }
    catch(err){
      console.log(err);
    }
  })

  //bakilcak
  router.use("/reset-password"  ,  (req , res) =>{
    res.render("../authPages/resetpass" , {message : req.session.messageRes});
  })

  router.post("/register" ,async (req , res,next) => {
    const fullname = req.body.fullName;
    const password = req.body.password;
    const email = req.body.email;
    const hashedPassword = await bcyrpt.hash(password , 10);
    const duplicateUser = await User.findOne({
      where : {
        email : email
      }
    })
    try{
      if (duplicateUser){
          req.session.message = "Bu kullanıcı zaten kayıtlı"
          res.redirect("/account/register");
      }
 
        await User.create({
            fullName : fullname ,
            password : hashedPassword , 
            email : email,
        })
      res.redirect("/account/login");
    }
    catch(err){
      if (err.name =="SequelizeUniqueConstraintError" || err.name=="SequelizeValidationError") {
        res.render("../authPages/register.ejs", {message : err.message})
      }
      else{
        next(err)
      }
    }
  })
  router.use("/register"  , async(req , res) => {
        const message = await req.session.message;
        delete req.session.message
        res.render("../authPages/register" , {message : message});
  })
  

  module.exports = router;