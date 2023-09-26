const express = require("express");
const router = express.Router();
const path = require("path")
const Category = require("../models/catTable");
const fs = require('fs')
const uploadimg = require("../multer/multeradd");
const Blog = require("../models/table");
const slugify = require("slugify");
const Role = require("../models/role");
const User = require("../models/UserModel")
const control =  {
    replacement: '-',
    remove: undefined,
    lower: true, 
    strict: true, 
    locale: 'tr',     
    trim: true         
  }

const isAuthControl = (req , res , next) => {
    if (req.session.isAuth != 1) {
        res.redirect("/account/login");
    }
    next();
}

const guestControl = (req , res , next)=>{
    if (req.session.roleType == "guest") {
        res.redirect("/account/permisson");
    }
    next();
}
router.post("/admin/blogedit/edit/:url" ,isAuthControl  , guestControl , uploadimg.upload.single("imgLink") , async (req,res)=>{
    const url = req.params.url;
    const baslik = req.body.CityName;
    const newUrl = slugify(baslik , control);
    const priceDaily = req.body.priceDaily;
    const CityDesc = req.body.CityDesc;
    const selectedContinents = req.body.selectContinent;
    const longDesc = req.body.long_desc
    let resim;
    
    if (req.file){
        resim = req.file.filename;
        if (req.body.imghidden != "nophoto.jpeg") {
            fs.unlink("./public/image/"+req.body.imghidden , (err)=>{
                console.log(err)
            })
        }
    }
    else{
        resim = "nophoto.jpeg"
    }
    try{
        console.log(req.body)
         await Blog.update({
            city_name : baslik ,
            city_desc : CityDesc , 
            city_budget : priceDaily ,
            city_long_desc : longDesc,
            url : newUrl 
        },
        {where : {
            url :url
        }})

        const blog = await Blog.findOne({
            where : {
                url : newUrl
            },
            include:{
                model : Category,
                attributes : ["id"],
            }
            
        });
        if (selectedContinents == undefined) {
          await blog.removeCategories(blog.Categories)
        }
        else{       
                await blog.removeCategories(blog.Categories);
                await blog.addCategory(selectedContinents);
        }

            res.redirect("/admin/blogedit?action=edit")
    }
    catch(err){
        console.log(err);
    }
})
//bak
router.post("/admin/addblog",isAuthControl , guestControl , uploadimg.upload.single("imgLink") , async (req , res) => {
    const baslik = req.body.CityName;
    const url = slugify(baslik , control);
    const priceDaily = req.body.priceDaily;
    const longDesc = req.body.long_desc;
    const selectedContinents = req.body.selectContinent;
    console.log(req.body)
    if (req.file){
        var resim = req.file.filename;
    }
    else{
        var resim = "nophoto.jpeg"
    }
    const CityDesc = req.body.CityDesc;
    
    try{
        console.log(resim )
     const blog = await Blog.create({
            city_name : baslik ,
            city_desc : CityDesc ,
            city_budget : priceDaily ,
            imgurl : resim ,
            city_long_desc : longDesc,
            url : url
       })
        if (selectedContinents) {
            for (let i = 0; i < selectedContinents.length; i++) {
               await blog.addCategory(selectedContinents[i])
            }
        }
       res.redirect("/");
      
    }
    catch(err){
        console.log(err);
    }
})

router.use("/admin/blogedit/delete/:url",isAuthControl , guestControl , async (req,res)=>{
    const url = req.params.url
    const action = req.query.action
    try{
       await Blog.destroy({
        where: {
          url: url
        }
      });
       if (action && action=="delete") {
           res.redirect("/admin/blogedit?action=delete");
           return
       }
       res.redirect("/admin/blogedit" , {action : "undefined"});
    }
    catch(err){
        console.log(err)
    }
})

router.use("/account/userlist" , isAuthControl , guestControl , async (req, res) => {
    const userlist = await User.findAll({
      include : {
        model : Role ,
        attributes : ["role_name"]
      }
    });
    try{
      res.render("../adminpages/userList" ,{userList : userlist});
    }
    catch(err){
      console.log(err)
    }
  })

router.use("/admin/addblog",isAuthControl , guestControl ,async (req,res)=>{
    try{
    const result = await Category.findAll();
          res.render("../adminpages/blogadd.ejs" , {category : result});
    }
    catch(err){
        console.log(err);
    }
})
router.use("/admin/blogedit/edit/:url",isAuthControl , guestControl ,async (req, res) =>{
    const url = req.params.url
    
    try{ 
        const data = await Blog.findOne({
            where : {
                url : url
            },
            include:{
                model : Category,
                attributes : ["id"],
            }
            
        });
        const category = await Category.findAll();
        res.render("../adminpages/blogedit2" , {data : data , category : category })
    }
    catch(err){
        console.log(err);
    }
})

router.use("/admin/blogedit" ,isAuthControl , guestControl ,async (req , res) => {
    const action = req.query.action
    try{
       const data = await Blog.findAll();
       if (action!="undefined" && action=="edit") {
        res.render("../adminpages/blogedit" , {data : data , action : "edit"}) 
        return
       }
       if (action!="undefined" && action=="delete") {
        res.render("../adminpages/blogedit" , {data : data , action : "delete"}) 
        return
       }
       res.render("../adminpages/blogedit" , {data : data , action : "undefined"})       
    }
    catch(err){
        console.log(err);
    }
})
router.use("/details/:id" ,isAuthControl, async (req,res)=>{
    let url = req.params.id;
    try{
       const result = await Blog.findAll({
            where : {
                url : url
            }
       })
       if (result) {
           res.render("../userpages/details" , {data : result})
       }
       else{
        res.redirect("/404")
       }
    }
    catch(err){
        console.log(err);
    }
})
router.use("/countries/:continent/:page" ,isAuthControl, async (req,res)=>{
    let continent =req.params.continent
    let page = req.params.page;
    try{
        const result = await Blog.findAll({
            include: {
                model : Category,
                where : {
                    url : continent
                }
            }
        })
        
            const start = parseInt((page-1)*4);
            const finish = parseInt(page)*4 ;
            const data = result.slice(start , finish);
    
        const category = await Category.findAll({
            attributes : ["url"]
        })
        res.render("../userpages/index.ejs" , {data : data , continent : continent ,category : category , page:parseInt(page)})
    }
    catch(err){
        console.log(err)
    }
})

router.use("/:page" ,isAuthControl, async (req,res)=>{
    var page = req.params.page;
try{
    const data1 = await Blog.findAll();
    const start = parseInt((page-1)*4);
    const finish = parseInt(page)*4 
    const data = data1.slice(start , finish);
    console.log(data)

    const category = await Category.findAll({
        attributes : ["url"]
    })
    res.render("../userpages/index.ejs" , {data : data , continent : "active" , category : category ,page : parseInt(page)});
}
catch(err){
    console.log(err)
}

})

router.use("/" ,isAuthControl, async (req,res)=>{
try{
    const data1 = await Blog.findAll();
    const data = data1.slice(0 , 4);
    const category = await Category.findAll({
        attributes : ["url"]
    })
    res.render("../userpages/index.ejs" , {data : data , continent : "active" , category : category ,page : 1 },);
}
catch(err){
    console.log(err)
}

})


module.exports = router;