const express = require('express')
const morgan = require('morgan')
var util = require("util")
var app = express()

morgan.token('body', (req, res) => {
    return util.inspect(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, resp) => {
    resp.send(`
<p>phonebook has ${persons.length} entries</p>
<br/>
<p>${new Date().toLocaleString()}</p>
`)
})

app.get('/api/persons', (req, resp) => {
    resp.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
    resp.json(persons.find(p => p.id === req.params.id))
})

app.delete('/api/persons/:id', (req, resp) => {
    persons = persons.filter(p => p.id !== req.params.id)
    resp.status(204).end()
})

const generateId = () => String(Math.trunc(Math.random() * 100000))

app.post('/api/persons', (req, resp) => {
    const person = req.body
    person.id = generateId()
    if (!person.name || !person.number) {
        resp.status(404).end()
    } else {
        persons = persons.concat(person)
        resp.json(person)
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`[log] running on port ${PORT}`)
})
