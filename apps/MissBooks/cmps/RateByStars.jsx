export function RateByStars({ val, onSetVal }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    className={n <= val ? 'filled' : ''}
                    onClick={() => onSetVal(n)}
                    style={{ cursor: 'pointer', fontSize: '1.5em' }}
                >
                    ★
                </span>
            ))}
        </div>
    )
}
