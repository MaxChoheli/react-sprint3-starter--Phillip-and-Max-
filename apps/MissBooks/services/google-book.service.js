export const googleBookService = {
    query
}

function query(searchTerm) {
    const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${searchTerm}`

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.items) return []
            return data.items.map(item => {
                return {
                    id: item.id,
                    title: item.volumeInfo.title
                }
            })
        })
}
