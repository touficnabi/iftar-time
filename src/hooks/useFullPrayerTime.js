import {useEffect, useState} from "react";

const useFullPrayerTime = (time) => {
    const [prayerTime, setPrayerTime] = useState(null);

    useEffect(() => {
        const [hour, minute] = time.split(/[:\s]+/);
        const date = new Date();
        const improvedTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        improvedTime.setHours(hour);
        improvedTime.setMinutes(minute);
        improvedTime.setSeconds(0);

        setPrayerTime(improvedTime.toJSON());
    } , [time]);
    return prayerTime;
}

export default useFullPrayerTime;