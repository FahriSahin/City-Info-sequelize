const express = require("express");
const router = require("./routers/rout")
const userRouter = require("./routers/userrout")
const app = express();
const sondata = require("./models/sondata");
const config = require("./database/config");
const sequelize = require("./database/connection")
const Category = require("./models/catTable");
const Blog = require("./models/table");
const User = require("./models/UserModel");
const path = require("path")
const bcyrpt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Role = require("./models/role")
app.set("view engine" ,"ejs") ;
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret : "isAuth" ,
    resave : false ,
    saveUninitialized : false ,
    store : new SequelizeStore({
        db : sequelize 
    })
}))

app.use((req,res,next) => {
    res.locals.isAuth = req.session.isAuth;
    res.locals.roleType = req.session.roleType;
    res.locals.message = req.session.message;
    res.locals.messageRes = req.session.messageRes;
    res.locals.emailRes = req.session.emailRes;
    res.locals.randomKey = req.session.randomKey;
    next();
})

app.use(cookieParser());
app.use(express.static(path.join(__dirname , "node_modules")));
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.static(path.join(__dirname , 'image')));

Category.belongsToMany(Blog , {through : "blogCategory"});
Blog.belongsToMany(Category , {through : "blogCategory"});

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Role , {through : "UserRole"});
Role.belongsToMany(User , {through : "UserRole"});
async function senkron(){
    try{
        console.log("adım 1")
        await sequelize.sync({ force: true })
        console.log("adım 2")

        await sondata();
    }
    catch(err){
        console.log(err)
    }
      
}
senkron();
app.use(express.urlencoded({extended : false}))

app.use("/account" , userRouter )
app.use("/",router)
app.use("*" , (req , res)=>{
    res.status(404).render("error/404");
})
 app.use((err , req ,res , next)=>{
     console.error(err);
     res.status(500).render("error/500");
 })

app.listen(3000 ,()=>{
    console.log("listening on port 3000")
})