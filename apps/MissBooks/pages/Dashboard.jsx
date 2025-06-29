import { bookService } from '../services/book.service.js'

const { useEffect, useState } = React

export function Dashboard() {
    const [categoryStats, setCategoryStats] = useState(null)

    useEffect(() => {
        bookService.query().then(books => {
            const stats = books.reduce((acc, book) => {
                const categories = book.categories || ['Uncategorized']
                categories.forEach(cat => {
                    acc[cat] = (acc[cat] || 0) + 1
                })
                return acc
            }, {})
            setCategoryStats(stats)
        })
    }, [])

    if (!categoryStats) return <div>Loading dashboard...</div>

    return (
        <section className="dashboard container">
            <h2>Books per Category</h2>
            <ul>
                {Object.entries(categoryStats).map(([category, count]) => (
                    <li key={category}>
                        {category}: {count} books
                    </li>
                ))}
            </ul>
        </section>
    )
}
