export function RateBySelect({ val, onSetVal }) {
    function handleChange({ target }) {
        onSetVal(+target.value)
    }

    return (
        <select value={val} onChange={handleChange}>
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
            ))}
        </select>
    )
}
