const mongoose = require('mongoose')

exports.connectMongoose = async()=>{
      const connectDB = await mongoose.connect('mongodb+srv://rifad:rifad@rifadscluster.iiqweco.mongodb.net/passport')
        if(connectDB) console.log('Database Started')
         
        return connectDB

    }

    const Schema = mongoose.Schema({
        name : String,
        
        username : {
           type : String,
           required : true,
           unique : true
        },
        password : String
    },{
        timestamps : true
    })

    exports.User = mongoose.model('User', Schema)
