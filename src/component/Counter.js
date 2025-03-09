const Counter = ({city, country, iftar, sehri, timeRemaining, heading}) => {

    //adding zero if less than 10
    const pad = n => {
        return n < 10 ? `0${n}` : n;
    }

    // plural or singuler
    const lebel = (n, label) => {
        return n === 1 ? `${label}` : `${label}s`;
    }

    return (
        <>
            <div className="timer-wrapper">       
                <div className="floating-box">
                    <div className="heading">
                        <h2>{heading}</h2>
                    </div>
                    <div className="timer">
                        <div className="tm-parts hours">
                            <div className="tm-part">
                                <p>{timeRemaining?.hours()}</p>
                                <span className="foot">{lebel(timeRemaining?.hours(), 'Hour')}</span>
                            </div>
                        </div>
                        <div className="tm-parts minutes">
                            <div className="tm-part">
                                <p>{pad(timeRemaining?.minutes())}</p>
                                <span className="foot">{lebel(timeRemaining?.minutes(), 'Minute')}</span>
                            </div>
                        </div> 
                        <div className="tm-parts seconds">
                            <div className="tm-part">
                                <p>{pad(timeRemaining?.seconds())}</p>
                                <span className="foot">{lebel(timeRemaining?.seconds(), 'Second')}</span>
                            </div>
                        </div> 
                    </div>
                    <div className="footer">
                    {city !== null && country !== null && <div className="footer-parts">
                            <div className="city-country">
                                <svg viewBox="0 0 368.553 368.553" xmlns="http://www.w3.org/2000/svg" width={15} fill="currentColor"> <path d="m184.28 0c-71.683 0-130 58.317-130 130 0 87.26 119.19 229.86 124.26 235.88 1.417 1.685 3.504 2.66 5.705 2.67h0.032c2.189 0 4.271-0.957 5.696-2.621 5.075-5.926 124.3-146.16 124.3-235.93-1e-3 -71.683-58.317-130-130-130zm0.045 349.25c-23.937-29.771-115.04-147.8-115.04-219.25 0-63.411 51.589-115 115-115s115 51.589 115 115c-1e-3 73.49-90.95 189.83-114.96 219.25z"/> <path d="m184.28 72.293c-30.476 0-55.269 24.793-55.269 55.269s24.793 55.269 55.269 55.269 55.269-24.793 55.269-55.269-24.793-55.269-55.269-55.269zm0 95.537c-22.204 0-40.269-18.064-40.269-40.269s18.064-40.269 40.269-40.269 40.269 18.064 40.269 40.269-18.066 40.269-40.269 40.269z"/> </svg>
                                <p>{city}<span>, {country}</span></p>
                            </div>
                        </div>}
                        <div className="footer-parts">
                            <div className="iftar">
                                <p>Iftar: {iftar}</p>
                            </div>
                        </div>
                        <div className="footer-parts">
                            <div className="sehri">
                                <p>Sehri: {sehri}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Counter;