import {useState} from 'react'
import '../componentStyles/Rating.css'

function Rating({value, onRatingChange, disabled}) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(value || 0);




    //handle star hover
    const handleMouseEnter = (rating) => {
        if (!disabled) {
            setHoveredRating(rating);
        }
    };

    //handle star leave
    const handleMouseLeave = () => {
        if (!disabled) {
            setHoveredRating(0);
        }
    };

    //handle star click
    const handleClick = (rating) => {
        if (!disabled) {
            setSelectedRating(rating);
            if (onRatingChange) {
                onRatingChange(rating);
            }
        }
    };

//function to generate stars based on rating
    const generateStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoveredRating || selectedRating);
            stars.push(
                <div
                    key={i}
                    className={`star ${isFilled ? 'filled' : ''}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(i)}

                    style={disabled ? { pointerEvents: 'none' } : {}}                    
                >
                    ★
                </div>
            );
        }
        return stars;
    };
    return (
        <div className="rating">
            {generateStars()}
            <span className="rating-value">{disabled ? selectedRating : hoveredRating}</span>
        </div>
    );



}

export default Rating
