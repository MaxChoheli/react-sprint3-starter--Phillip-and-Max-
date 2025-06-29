export function BookPreview({ book }) {
    const { title, listPrice, imgUrl } = book

    return (
        <article className="book-preview">
            <h3>{title}</h3>
            <p>
                Price: {listPrice.amount} {listPrice.currencyCode}
            </p>
            <img src={imgUrl} alt={title} />
        </article>
    )
}
