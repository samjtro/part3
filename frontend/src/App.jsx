import { useState, useEffect } from 'react'
import db from './services/db'
import './index.css'

const Person = ({person, deletePerson}) => {
  return (
    <>
      <p>{person.name}: {person.number}</p>
      <button id={person.id} onClick={deletePerson}>delete</button>
    </>
  )
}

const Filter = (params) => {
  return (
    <form>
      <div>
        filter: <input value={params.value} onChange={params.func} />
      </div>
    </form>
  )
}

const Add = (params) => {
  return (
    <form onSubmit={params.addName}>
      <div>
        name: <input value={params.newName} onChange={params.handleNameChange}/>
      </div>
      <div>
        phone #: <input value={params.newPhone} onChange={params.handlePhoneChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Phonebook = (params) => {
  return (
    <>
      <h2>Phonebook</h2>
      <Filter value={params.filterValue} func={params.handleFilterValueChange} />
      {params.filteredPersons.map((person) => {return <Person key={person.id} person={person} deletePerson={params.deletePerson} />})}
    </>
  )
}

const Notification = ({message, isError}) => {
  if (message === null) {
    return null
  }
  if (isError) {
    return (
      <div className='notif error'>
        {message}
      </div>
    )
  }
  return (
    <div className='notif alert'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])
  const [notifMessage, setNotifMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    db
      .getAll()
      .then(response => {
        setPersons(response)
        setFilteredPersons(response)
      })
  }, [])
  const handleNameChange = (event) => setNewName(event.target.value)
  const handlePhoneChange = (event) => setNewPhone(event.target.value)
  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value)
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }
  const addPerson = (event) => {
    var t = false
    var index = 0
    persons.forEach((p, i) => {
      if (p.name === newName) {
        t = true
        index = i
      }
    })
    if (!t) {
      event.preventDefault()
      db
        .create({
          id: String(Number(persons[persons.length-1].id) + 1),
          name: newName,
          phone: newPhone
        })
        .then(response => {
          setPersons(persons.concat(response))
          setFilteredPersons(filteredPersons.concat(response).filter(p => p.name.toLowerCase().includes(filterValue.toLowerCase())))
          setIsError(false)
          setNotifMessage(`Created ${response.name}: ${response.phone}`)
          setTimeout(() => {setNotifMessage(null)}, 5000)
        })
      setNewName('')
      setNewPhone('')
    } else {
      if (window.confirm(`${newName} already exists. would you like to replace the current number with the new one?`)) {
        db
          .update(persons[index].id, {
            id: persons[index].id,
            name: persons[index].name,
            phone: newPhone
          })
          .then(response => {
            setPersons(persons.map(p => p.id !== id ? p : response))
            setFilteredPersons(filteredPersons.map(p => p.id !== id ? p : response).filter(p => p.name.toLowerCase().includes(filterValue.toLowerCase())))
          })
          .catch(error => {
            setIsError(true)
            setNotifMessage(`Error: ${error}`)
            setTimeout(() => {setErrorMessage(null)}, 5000)})
        setNewName('')
        setNewPhone('')
      }
    }
  }
  const deletePerson = (event) => {
    const person = filteredPersons.filter(person => person.id === event.target.id)
    if (window.confirm(`delete ${person[0].name}?`)) {
      db
        .deleteItem(event.target.id)
        .then(() => {
          setIsError(false)
          setNotifMessage(`Deleted ${person[0].name}: ${person[0].phone}`)
          setTimeout(() => {setNotifMessage(null)}, 5000)
        })
      setPersons(persons.filter(person => person.id !== event.target.id))
      setFilteredPersons(filteredPersons.filter(person => person.id !== event.target.id))
    }
  }

  return (
    <div>
      <Notification message={notifMessage} isError={isError} />
      <Add addName={addPerson} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <Phonebook filterValue={filterValue} handleFilterValueChange={handleFilterValueChange} filteredPersons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
