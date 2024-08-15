const express = require('express')
const morgan = require('morgan')
const Entry = require('./models/entry')
const mongoose = require('mongoose')
var util = require("util")
var app = express()

morgan.token('body', (req, res) => {
    return util.inspect(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

const handle = ({err}) => {
    console.log('[err] invalid request - ')
    mongoose.connection.close()
}

app.get('/info', (req, resp) => {
    resp.send(`
<p>phonebook has ${persons.length} entries</p>
<br/>
<p>${new Date().toLocaleString()}</p>
`)
})

app.get('/api/persons', (req, resp) => {
    Entry
        .find({})
        .then(n => {
            resp.json(n)
        })
        .catch(err => handle(err))
})

app.get('/api/persons/:id', (req, resp) => {
    Entry
        .findById(req.params.id)
        .then(r => {
            resp.json(r)
        })
        .catch(err => handle(err))
})

app.delete('/api/persons/:id', (req, resp) => {
    persons = persons.filter(p => p.id !== req.params.id)
    resp.status(204).end()
})

const generateId = () => String(Math.trunc(Math.random() * 100000))

app.post('/api/persons', (req, resp) => {
    const entry = new Entry({
        name: req.body.name,
        number: req.body.number,
    })
    entry
        .save()
        .then(r => {
            resp.json(r)
        })
        .catch(err => handle(err))
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`[log] running on port ${PORT}`)
})
