//Create schema for Sheet

const mongoose = require('mongoose')

const Sheet = new mongoose.Schema(
    {
        //userId: {type: Number, required: true, unique: true}, 
        googleID: {type:String},
        sheetID: {type: String},
        columnCount: {type: Number},
    },

    {collection: 'sheet-data' }
)

const model = mongoose.model('SheetData', Sheet)

module.exports = model