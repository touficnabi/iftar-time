const Footer = ({Fajr, Maghrib, date, methods, setMethod, defaultMethod}) => {
    //concert the 24 hours format to 12 hours format
    const timeConvert = time => {
        time = time?.split(" ")[0].toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        
        if(time.length > 1) {
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // assign AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="method">
                    <h3>Source: </h3>
                    <select onChange={setMethod} name="method" defaultValue={defaultMethod}>
                        {methods.map(method => method.name && <option key={method.id} value={method.id}>{method.name}</option>)}
                    </select>
                </div>
                <div className="footer-info">
                    <div className="date">
                        <p className="day">{date?.day}</p> <p className="month">{date?.month.en}</p>
                    </div>
                    <p className="footer1/3 center iftar">Iftar: {timeConvert(Maghrib)}</p>
                    <p className="footer1/3 Sehri">Sehri: {timeConvert(Fajr)}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;