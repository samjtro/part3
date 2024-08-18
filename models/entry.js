require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI)

const isANumber = ({n}) => {
    if (n >= '0' && n <= '9') {
        return true
    } else {
        return false
    }
}

const validatePhoneNumber = (n) => {
    var t = false
    var arr = n.split("")
    if (n.split("-").length > 2) {
        return(t)
    }
    var count = 0
    arr.forEach(i => {
        if (!isANumber(i)) {
            return(t)
        } else if(i==="-") {
            count = count + 1
        }
    })
    if (arr.indexOf("-")===-1) {
        return(t)
    } else if (arr.indexOf("-")<2 || arr.indexOf("-")>3) {
        return(t)
    }
    t = true
    return(t)
}

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: validatePhoneNumber
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
