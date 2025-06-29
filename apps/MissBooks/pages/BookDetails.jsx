import { bookService } from "../services/book.service.js"
import { LongTxt } from '../cmps/LongTxt.jsx'
import { AddReview } from '../cmps/AddReview.jsx'
import { showUserMsg } from '../services/event-Bus.Service.js'

const { useEffect, useState } = React
const { Link, useParams } = ReactRouterDOM

export function BookDetails() {
    const params = useParams()
    const bookId = params.bookId
    const [book, setBook] = useState(null)

    useEffect(() => {
        bookService.get(bookId).then(setBook)
    }, [bookId])

    if (!book) return <div>Loading...</div>

    const pageCountDesc = book.pageCount > 500
        ? 'Serious Reading'
        : book.pageCount > 200
            ? 'Descent Reading'
            : book.pageCount < 100
                ? 'Light Reading'
                : ''

    const yearsSincePublished = new Date().getFullYear() - book.publishedDate
    const publishDesc = yearsSincePublished > 10
        ? 'Vintage'
        : yearsSincePublished < 1
            ? 'New'
            : ''

    const priceClass = book.listPrice.amount > 150
        ? 'expensive'
        : book.listPrice.amount < 20
            ? 'cheap'
            : ''

    function onAddReview(review) {
        bookService.addReview(book.id, review)
            .then(savedBook => {
                setBook(savedBook)
                showUserMsg('Review added!')
            })
            .catch(err => {
                console.error(err)
                showUserMsg('Failed to add review', 'error')
            })
    }

    function onRemoveReview(reviewId) {
        bookService.removeReview(book.id, reviewId)
            .then(savedBook => {
                setBook(savedBook)
                showUserMsg('Review removed!')
            })
            .catch(err => {
                console.error(err)
                showUserMsg('Failed to remove review', 'error')
            })
    }

    function goToNext(diff) {
        bookService.getNextBookId(book.id, diff)
            .then(nextBookId => {
                location.hash = `#/book/${nextBookId}`
            })
    }

    return (
        <section className="book-details">
            <Link to="/book" className="btn">Back</Link>
            <h1>{book.title}</h1>
            {book.subtitle && <h3>{book.subtitle}</h3>}

            <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p><strong>Categories:</strong> {book.categories.join(', ')}</p>
            <p><strong>Language:</strong> {book.language}</p>

            <LongTxt txt={book.description} />

            <img src={book.imgUrl} alt={book.title} />

            <p>
                Price: <span className={priceClass}>{book.listPrice.amount} {book.listPrice.currencyCode}</span>
            </p>
            {book.listPrice.isOnSale && <p style={{ color: 'red' }}>On Sale!</p>}

            <p>Page Count: {book.pageCount} – {pageCountDesc}</p>
            <p>Published: {book.publishedDate} {publishDesc && `– ${publishDesc}`}</p>

            <AddReview onAddReview={onAddReview} />

            {book.reviews && book.reviews.length > 0 && (
                <section className="reviews">
                    <h2>Reviews</h2>
                    <ul>
                        {book.reviews.map(review => (
                            <li key={review.id}>
                                <p><strong>{review.fullname}</strong></p>
                                <p>Rating: {review.rating}</p>
                                <p>Read At: {review.readAt}</p>
                                <button onClick={() => onRemoveReview(review.id)} className="btn">Remove</button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="book-nav">
                <button onClick={() => goToNext(-1)} className="btn">Prev Book</button>
                <button onClick={() => goToNext(1)} className="btn">Next Book</button>
            </section>
        </section>
    )
}
