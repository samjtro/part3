const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('[err] invalid declaration. please provide your mongodb password.')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://sjt:${password}@fso.9rgsa.mongodb.net/p3-phonebook?retryWrites=true&w=majority&appName=fso`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Entry = mongoose.model('Entry', entrySchema)
const handle = ({err}) => {
    console.log('[err] invalid request - ' + err)
    mongoose.connection.close()
}

if (process.argv.length==5) {
    new Entry({
        name: process.argv[3],
        number: process.argv[4],
    })
        .save()
        .then(result => {
            console.log(`added ${process.argv[3]}:${process.argv[4]} to phonebook`)
            mongoose.connection.close()
        })
        .catch(err => handle(err))
} else if (process.argv.length==3) {
    Entry
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(p => {
                console.log(`${p.name}:${p.number}`)
            })
            mongoose.connection.close()
        })
        .catch(err => handle(err))
}
