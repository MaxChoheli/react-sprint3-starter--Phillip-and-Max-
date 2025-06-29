export function RateByTextbox({ val, onSetVal }) {
    function handleChange({ target }) {
        const rating = +target.value
        if (rating >= 1 && rating <= 5) onSetVal(rating)
    }

    return (
        <input
            type="number"
            min="1"
            max="5"
            placeholder="Enter rating (1-5)"
            value={val}
            onChange={handleChange}
        />
    )
}
