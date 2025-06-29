import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"
import { BookDetails } from "./BookDetails.jsx"
import { showUserMsg } from '../services/event-Bus.Service.js'

const { useState, useEffect, Fragment } = React
const { useSearchParams } = ReactRouterDOM

export function BookIndex() {
    const [books, setBooks] = useState(null)
    const [selectedBookId, setSelectedBookId] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const [filterBy, setFilterBy] = useState(() => {
        return {
            txt: searchParams.get('txt') || ''
        }
    })

    useEffect(() => {
        loadBooks()
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy)
            .then(setBooks)
            .catch(err => console.log('err:', err))
    }

    function onRemoveBook(bookId) {
        bookService.remove(bookId)
            .then(() => {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
                showUserMsg('Book removed!')
            })
            .catch(err => {
                console.error(err)
                showUserMsg('Failed to remove book', 'error')
            })
    }

    function onSetFilter(newFilter) {
        setFilterBy(prev => ({ ...prev, ...newFilter }))
        setSearchParams(newFilter)
    }

    function onSelectBookId(bookId) {
        setSelectedBookId(bookId)
    }

    if (!books) return <div>Loading...</div>

    return (
        <section className="book-index">
            {selectedBookId &&
                <BookDetails
                    bookId={selectedBookId}
                    onBack={() => setSelectedBookId(null)}
                />}

            {!selectedBookId &&
                <Fragment>
                    <BookFilter
                        defaultFilter={filterBy}
                        onSetFilter={onSetFilter}
                    />
                    <BookList
                        books={books}
                        onRemoveBook={onRemoveBook}
                        onSelectBookId={onSelectBookId}
                    />
                </Fragment>}
        </section>
    )
}
