const { useState, useEffect } = React

import { googleBookService } from '../services/google-book.service.js'
import { bookService } from '../services/book.service.js'
import { showUserMsg } from '../services/event-Bus.Service.js'

export function BookAdd() {
    const [searchTerm, setSearchTerm] = useState('')
    const [googleBooks, setGoogleBooks] = useState([])

    useEffect(() => {
        if (!searchTerm) return
        const timeoutId = setTimeout(() => {
            googleBookService.query(searchTerm)
                .then(setGoogleBooks)
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    function handleChange({ target }) {
        setSearchTerm(target.value)
    }

    function onAddGoogleBook(googleBook) {
        bookService.addGoogleBook(googleBook)
            .then(() => {
                showUserMsg('Book added from Google API!')
            })
            .catch(err => {
                console.error(err)
                showUserMsg('Failed to add book', 'error')
            })
    }

    return (
        <section className="book-add">
            <h2>Add Book from Google</h2>
            <input
                type="text"
                placeholder="Search Google Books..."
                value={searchTerm}
                onChange={handleChange}
            />

            <ul>
                {googleBooks.map(book => (
                    <li key={book.id}>
                        {book.title}
                        <button onClick={() => onAddGoogleBook(book)} className="btn">+</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}
