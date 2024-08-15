require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI)

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
})
entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)
