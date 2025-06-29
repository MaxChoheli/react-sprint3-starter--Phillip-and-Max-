import { RateBySelect } from './RateBySelect.jsx'
import { RateByStars } from './RateByStars.jsx'
import { RateByTextbox } from './RateByTextbox.jsx'

const { useState } = React

export function AddReview({ onAddReview }) {
    const [review, setReview] = useState({
        fullname: '',
        rating: 5,
        readAt: ''
    })

    const [ratingType, setRatingType] = useState('select')

    function handleChange({ target }) {
        const { name, value } = target
        setReview(prev => ({ ...prev, [name]: value }))
    }

    function onSetVal(val) {
        setReview(prev => ({ ...prev, rating: val }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        onAddReview(review)
        setReview({ fullname: '', rating: 5, readAt: '' })
    }

    function getRatingCmp() {
        switch (ratingType) {
            case 'stars':
                return <RateByStars val={review.rating} onSetVal={onSetVal} />
            case 'textbox':
                return <RateByTextbox val={review.rating} onSetVal={onSetVal} />
            default:
                return <RateBySelect val={review.rating} onSetVal={onSetVal} />
        }
    }

    return (
        <section className="add-review">
            <h2>Add Review</h2>
            <form onSubmit={onSubmit}>
                <label>
                    Full Name:
                    <input
                        type="text"
                        name="fullname"
                        value={review.fullname}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Read At:
                    <input
                        type="date"
                        name="readAt"
                        value={review.readAt}
                        onChange={handleChange}
                        required
                    />
                </label>

                <fieldset>
                    <legend>Rating Type:</legend>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="select"
                            checked={ratingType === 'select'}
                            onChange={() => setRatingType('select')}
                        />
                        Select
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="textbox"
                            checked={ratingType === 'textbox'}
                            onChange={() => setRatingType('textbox')}
                        />
                        Textbox
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="stars"
                            checked={ratingType === 'stars'}
                            onChange={() => setRatingType('stars')}
                        />
                        Stars
                    </label>
                </fieldset>

                <label>Rating:</label>
                {getRatingCmp()}

                <button>Add</button>
            </form>
        </section>
    )
}
