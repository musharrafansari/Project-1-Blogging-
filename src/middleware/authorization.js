// const jwt = require('jsonwebtoken')
// const { find } = require('../model/authorModel')
// const blogModel = require('../model/blogModel')


// const authorize =  function(req,res,next){

//     try{

//     //    let data = req.body.authorId
//     //    let data1 = req.query.authorId
//     //    let data2 = req.params

// //         let authorId = await blogModel.findById(data2).select({authorId:1,_id:0})
// //    console.log(authorId);

//         const token = req.headers['x-api-key']
//         if(!token) res.status(401).send({status:false, msg:"missing a mandatory token😒"})

//         let decodedToken = jwt.verify(token, "FunctionUp-radon")

//         let userId = decodedToken.UserId

//         if(userId == data|| userId== data1|| userId == data2){
//             res.status(200).send({status:true, msg:'You are able delete or edit the blog😁'})
//             next()
//         }
//         else{
//             res.status(403).send({status:false, msg:'You are not able to modify the blog'})

          
//         }

//     }catch(err){
//         res.status(500).send({data: err.message})
//     }

// }

// module.exports.authorize = authorize