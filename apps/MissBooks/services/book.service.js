import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BOOK_KEY = 'bookDB'
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    addReview,
    removeReview,
    getNextBookId,
    addGoogleBook
}

function query(filterBy = getDefaultFilter()) {
    return storageService.query(BOOK_KEY).then(books => {
        if (!filterBy.title && !filterBy.maxPrice) return books

        return books.filter(book =>
            book.title.toLowerCase().includes(filterBy.title.toLowerCase()) &&
            book.listPrice.amount <= filterBy.maxPrice
        )
    })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId)
}

function remove(bookId) {
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}

function getDefaultFilter() {
    return { title: '', maxPrice: 9999 }
}

function _createBooks() {
    let books = utilService.loadFromStorage(BOOK_KEY)
    if (!books || !books.length) {
        const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']
        books = []
        for (let i = 0; i < 20; i++) {
            const book = {
                id: utilService.makeId(),
                title: utilService.makeLorem(2),
                subtitle: utilService.makeLorem(4),
                authors: [utilService.makeLorem(1)],
                publishedDate: utilService.getRandomIntInclusive(1950, 2024),
                description: utilService.makeLorem(20),
                pageCount: utilService.getRandomIntInclusive(20, 600),
                categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
                imgUrl: `BooksImages/${i + 1}.jpg`,
                language: "en",
                listPrice: {
                    amount: utilService.getRandomIntInclusive(80, 500),
                    currencyCode: "EUR",
                    isOnSale: Math.random() > 0.7
                },
                reviews: []
            }
            books.push(book)
        }
        utilService.saveToStorage(BOOK_KEY, books)
    }
}

function addReview(bookId, review) {
    return get(bookId).then(book => {
        if (!book.reviews) book.reviews = []
        review.id = utilService.makeId()
        book.reviews.unshift(review)
        return save(book)
    })
}

function removeReview(bookId, reviewId) {
    return get(bookId).then(book => {
        book.reviews = book.reviews.filter(r => r.id !== reviewId)
        return save(book)
    })
}

function getNextBookId(bookId, diff = 1) {
    return storageService.query(BOOK_KEY).then(books => {
        const idx = books.findIndex(book => book.id === bookId)
        let nextIdx = idx + diff

        if (nextIdx >= books.length) nextIdx = 0
        if (nextIdx < 0) nextIdx = books.length - 1

        return books[nextIdx].id
    })
}

function addGoogleBook(googleBook) {
    return storageService.query(BOOK_KEY).then(books => {
        if (books.find(book => book.id === googleBook.id)) {
            return Promise.reject('Book already exists')
        }

        const newBook = {
            id: googleBook.id,
            title: googleBook.title || 'No Title',
            subtitle: googleBook.subtitle || '',
            authors: googleBook.authors || ['Unknown'],
            publishedDate: googleBook.publishedDate || 2024,
            description: googleBook.description || 'No description',
            pageCount: googleBook.pageCount || 100,
            categories: googleBook.categories || ['General'],
            imgUrl: googleBook.thumbnail ? googleBook.thumbnail : 'BooksImages/1.jpg',
            language: googleBook.language || 'en',
            listPrice: {
                amount: utilService.getRandomIntInclusive(80, 500),
                currencyCode: 'USD',
                isOnSale: Math.random() > 0.7
            },
            reviews: []
        }

        books.push(newBook)
        utilService.saveToStorage(BOOK_KEY, books)
        return Promise.resolve()
    })
}


