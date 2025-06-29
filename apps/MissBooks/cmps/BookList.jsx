import { BookPreview } from "./BookPreview.jsx"

const { Link } = ReactRouterDOM

export function BookList({ books, onRemoveBook }) {
    return (
        <ul className="book-list container">
            {books.map(book =>
                <li key={book.id}>
                    <BookPreview book={book} />
                    <section>
                        <button onClick={() => onRemoveBook(book.id)} className="btn">
                            Remove
                        </button>
                        <Link to={`/book/${book.id}`} className="btn">Details</Link>
                    </section>
                </li>
            )}
        </ul>
    )
}
