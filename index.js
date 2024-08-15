const express = require('express')
const morgan = require('morgan')
const Entry = require('./models/entry')
var util = require("util")
var app = express()

morgan.token('body', (req, res) => {
    return util.inspect(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

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
})

app.get('/api/persons/:id', (req, resp, next) => {
    Entry
        .findById(req.params.id)
        .then(r => {
            resp.json(r)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, resp, next) => {
    Entry
        .findByIdAndDelete(req.params.id)
        .then(r => {
            resp.status(204).end()
        })
        .catch(err => next(err))
})

const generateId = () => String(Math.trunc(Math.random() * 100000))

app.post('/api/persons', (req, resp, next) => {
    const entry = new Entry({
        name: req.body.name,
        number: req.body.number,
    })
    Entry
        .save()
        .then(r => {
            resp.json(r)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, resp, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number,
    }
    Entry
        .findByIdAndUpdate(req.params.id, person, {new:true})
        .then(r => resp.json(r))
        .catch(err => next(err))
})

const errorHandler = (error, req, resp, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return resp.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`[log] running on port ${PORT}`)
})
