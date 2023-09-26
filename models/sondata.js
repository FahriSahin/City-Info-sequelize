const Blog = require("../models/table");
const Category = require("../models/catTable");
const User = require("../models/UserModel")
const slugify = require("slugify");
const Role = require("../models/role");
const bcyrpt = require('bcrypt');

async function veriEkleme(){
    let control =  {
        replacement: '-',  
        remove: undefined, 
        lower: true,      
        strict: true,     
        locale: 'tr',      
        trim: true  
      }
    try{
       const category = await Category.bulkCreate([
            {category_name2 : "Europe" , url:slugify("Europe",control)},
            {category_name2 : "Asia", url:slugify("Asia",control)},
            {category_name2 : "Euroasia", url:slugify("Euroasia",control)},
            {category_name2 : "Africa", url:slugify("Africa",control)},
        ])

         const user = await User.bulkCreate([
            {email : "55fahrisahin55@gmail.com",
            password :await bcyrpt.hash("123" , 10),
            fullName : "Fahri Şahin"},
            {email : "oyungunlugu5509@gmail.com",
            password :await bcyrpt.hash("123" , 10) ,
            fullName : "user guest"},
            {email : "firohan122@gmail.com",
            password :await bcyrpt.hash("123" , 10),
            fullName : "user mod"},
        ])

       const role = await Role.bulkCreate([
            {role_name : "admin"},
            {role_name : "guest"},
            {role_name : "mod"},
        ])
        

       const blog = await Blog.bulkCreate([
            {
                city_name : "İstanbul",
                url :slugify("İstanbul",control),
                city_desc :"Ayasofya , Topkapı Sarayı ,Sultanahmet Camii ,Kapalıçarşi" ,
                city_budget : "50-70€",
                city_long_desc : "İstanbul, Türkiye'nin en büyük ve en tarihi şehri olarak öne çıkar. Hem Asya hem de Avrupa kıtalarına uzanan bu eşsiz şehir, tarihi zenginliği, kültürel çeşitliliği, benzersiz manzaraları ve lezzetli mutfağıyla ünlüdür. İşte İstanbul hakkında 200 kelimelik bir yazı:  İstanbul, 2600 yıl boyunca pek çok medeniyete ev sahipliği yapmıştır ve bu nedenle şehirde tarihi izler her adımda görülebilir. Ayasofya, Bizans İmparatorluğu döneminden kalma ve müslümanlar için de önemli bir anlam taşıyan bir yapıdır. Topkapı Sarayı, Osmanlı İmparatorluğu'nun eski başkenti olan İstanbul'un zengin tarihini yansıtan başka bir önemli yapılardan biridir. ",
                imgurl : "2.jpeg",    
            },
            {
                city_name : "City of Barselona",
                url :slugify("City of Barselona",control),
                city_desc :"La Sagrada Familia, Park Güell, La Rambla, Montjuïc Tepesi." ,
                city_budget : "70-90€",
                city_long_desc : "Barselona, İspanya'nın Katalonya bölgesinde yer alan ve Akdeniz kıyısında bulunan büyüleyici bir şehirdir. Tarihi ve kültürel zenginliği, muhteşem plajları ve benzersiz mimarisi ile tanınır. Barselona, Antoni Gaudí'nin eserleriyle ünlüdür. Gaudí'nin en ünlü eseri, muhteşem Sagrada Familia Bazilikası'dır. Bu etkileyici yapı, hala inşa halindedir ve mimari harikasıyla ziyaretçileri büyüler.  Şehrin sembollerinden biri de Park Güell'dir. Bu renkli ve sıradışı park, Gaudí'nin benzersiz tasarımının bir örneğidir.",
                imgurl : "4.jpeg",
            },
            {
                city_name : "Roma",
                url :slugify("Roma",control),
                city_desc :"Colosseum, Roma Forumu, Vatikan Şehri, Pantheon." ,
                city_budget : "90-120€",
                city_long_desc : "Roma, İtalya'nın başkenti ve tarihi zenginliği ile ünlü bir şehirdir. Ebedi Şehir olarak da bilinen Roma, antik döneme ait kalıntıları, etkileyici yapıları ve sanat eserleri ile tarih tutkunları ve gezginler için vazgeçilmez bir destinasyondur.  Roma'nın en ikonik yapısı, muhtemelen dünyanın en ünlü amfitiyatrosu olan Colosseum'dur. Bu antik arenada gladyatör dövüşleri ve diğer etkinlikler düzenlenirdi. Forum Romanum ise Roma İmparatorluğu'nun merkeziydi ve antik dönemin önemli politik ve ticaret merkezi olarak hala ayakta duran antik yapıları görmek için harika bir yerdir.  Vatikan Şehri, Roma'nın sınırları içindedir ve Papa'nın ikametgahıdır.",
                imgurl : "5.jpeg",
            }
        ])

        await user[0].addRole(role[0])
        await user[1].addRole(role[1])
        await user[2].addRole(role[2])


        await category[0].addBlog(blog[0])
        await category[0].addBlog(blog[1])
        await category[0].addBlog(blog[2])
        await category[1].addBlog(blog[0])
        await category[2].addBlog(blog[0])
    }
    catch(err){
        console.log(err)
    }
}

module.exports = veriEkleme;