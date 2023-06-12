import { useState, useEffect } from 'react'
import axios from 'axios'

import phoneService from './services/pnumbers'
import {Notification, NotificationError} from './components/Notification'


const App = () => {
  // Data
  const [persons, setPersons] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationErrorMessage, setNotificationErrorMessage] = useState(null)

  // Fetch data from the local db
  useEffect(() => {
    phoneService
      .getAll()
      .then(initialNumbers => {
        setPersons(initialNumbers)
      })
  }, [refresh]);

  const [filter, setNewFilter] = useState('');

  // Filter input field listener
  const handleFilterChange = (event) => setNewFilter(event.target.value)

  // Filter names if needed
  const notesToShow = filter === ''
    ? persons
    : persons.filter(note => note.name.includes(filter))


  // Deleting entry
  const handleDeletion = (person) => {

    phoneService
      .deleteNumber(person)
      .then(response => {
        setRefresh(Math.random);
      })
      .catch(error => {
        console.log(`Error removing contact. Message: '${error}'`);
        setNotificationErrorMessage(
          `Error occurred while attempting to remove '${person.name}' from phonebook. Person might have already been deleted from the server`
        )
        setTimeout(() => {
          setNotificationErrorMessage(null)
        }, 5000)
      })
  }


  // Code triggered when note is added
  const addNote = (event) => {
    event.preventDefault(); // Prevent regular form submission

    // Get submitted details
    const submittedName = event.target.querySelector("#username").value;
    const submittedPhoneNumber = event.target.querySelector("#pnumber").value;

    // Empty name field
    if (submittedName === '') {
      alert(`Name field is required!`);
      return;
    }


    // Check for dublicate name
    const duplicateFound = persons.find(person => person.name === submittedName);

    if (duplicateFound) {
      alert(`${submittedName} is already added to phonebook`);
      return;
    }

    // Reset name field
    event.target.querySelector("#username").value = '';
    event.target.querySelector("#pnumber").value = '';

    const personObject = {
      'name': submittedName,
      'number': submittedPhoneNumber,
      'id': (persons[persons.length - 1]?.id ?? 0) + 1
    }

    phoneService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNotificationMessage(
          `'${returnedPerson.name}' added to phonebook`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <NotificationError message={notificationErrorMessage} />
      <Filter filterValue={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new: </h3>

      <Form handleSubmit={addNote} />

      <h3>Numbers</h3>

      <Persons personList={notesToShow} handleDelete={handleDeletion} />
    </div>
  )
}



// Filter element
const Filter = ({ filterValue, handleFilterChange }) => <div> Filter: <input id="filter" value={filterValue} onChange={handleFilterChange} /> </div>

// Form element
const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div> name: <input id="username" /> </div>
    <div> number: <input id="pnumber" /> </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);


// Persons element
const Persons = ({ personList, handleDelete }) => (

  <div> {personList.map(person => <Note person={person} key={person.id} handleDelete={handleDelete} />)}</div>
);

// Course element
const Note = ({ person, handleDelete }) => (
  <div key={person.id}>
    {person.name} {person.number}
    <button onClick={() => handleDelete(person)}>Delete</button>
  </div>
);

export default App

