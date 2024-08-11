const express = require('express')
const app = express()

app.use(express.json())

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

const generateId = () => {
    return String(Math.trunc(Math.random() * 100000))
}

app.post('/api/persons', (req, resp) => {
    const person = {
        "id": generateId(),
        "name": "",
        "number": "",
    }
    persons = persons.concat(person)
    resp.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`[log] running on port ${PORT}`)
})
