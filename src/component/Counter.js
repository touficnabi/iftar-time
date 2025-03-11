const Counter = ({timeRemaining, heading}) => {

    //Play Adhan
    const adhanPlay = () => {
        const adhan = new Audio();
        adhan.src = 'https://playground.toufic.me/iftar-staging/Adhan2.mp3';
        adhan.play();
        console.log('Adhan Playing')
    }  

    //Play the Adhan if the time couter hits 1 secon and then wait one second before playing the audio
    if (parseInt(timeRemaining?.asSeconds()) === 1) {
        setTimeout(() => {
            adhanPlay();
        }, [1000])
    }

    

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
                </div>
            </div>
        </>
    )
}

export default Counter;