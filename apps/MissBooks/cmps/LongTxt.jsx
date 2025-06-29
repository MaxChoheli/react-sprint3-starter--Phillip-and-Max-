const { useState } = React

export function LongTxt({ txt, length = 100 }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const displayText = isExpanded ? txt : txt.substring(0, length)

    function toggleExpand() {
        setIsExpanded(prev => !prev)
    }

    return (
        <p>
            {displayText}
            {txt.length > length && (
                <span>
                    {!isExpanded ? '...' : ''}
                    <button onClick={toggleExpand}>
                        {isExpanded ? ' Read Less' : ' Read More'}
                    </button>
                </span>
            )}
        </p>
    )
}
