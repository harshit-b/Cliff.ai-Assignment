//Create Schema for User

const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        //userId: {type: Number, required: true, unique: true}, 
        name: {type: String},
        password: {type: String},
        email: {type: String},
        googleID: {type: String},
        sheetIDs: [{type : String}],
        quote: {type: String},
    },

    {collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

module.exports = model