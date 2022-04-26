const useDistance = (lat1, long1, lat2, long2, name) => {
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;

    const distance = long1 - long2;
    const radDistance = (Math.PI * distance) / 180;

    let dist = 
        Math.sin(radLat1) * Math.sin(radLat2) + 
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDistance);

    if (dist > 1) {
        dist = 1;
    }

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (name === 'K') {
        dist = dist * 1.609344;
    }
    if (name === 'N') {
        dist = dist * 0.8684;
    }

    return dist;
}

export default useDistance;