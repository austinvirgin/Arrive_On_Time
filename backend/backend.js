import { getApiKey } from "./api.js";

async function apiKeyCall() {
    return await getApiKey()
}

async function getETA(origin, destination, transportation_type = 'walking', key) {
    console.log(`${origin} ${destination} ${transportation_type} ${key}`)
    // const mode = mapMode(transportation_type)
    const params = new URLSearchParams({
        origins: `${origin} rexburg`,
        destinations: `${destination} rexburg`,
        mode: transportation_type,
        key
    })

    let result = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params}`);
    const text = await result.text();
    const data = JSON.parse(text)
    const seconds = data.rows[0].elements[0].duration.value;
    return seconds / 60
}

export async function calculateTime(origin, destination, transportation_type, appointmentTime) {
    console.log(`${origin} ${destination} ${transportation_type} ${appointmentTime}`);
    let api = await apiKeyCall()
    let time = new Time(appointmentTime)
    let minutes = await getETA(origin, destination, transportation_type, api)
    time.subtractTime(minutes)
    return time.getTime(appointmentTime);
}

class Time{

    constructor(time){
        let [ hours, minutes_tod ] = time.split(":");
        hours = Number(hours)
        let [minutes, tod] = minutes_tod.split(" ")
        minutes = Number(minutes)
        if (tod == "pm" && hours != 12){
            hours += 12;
        }
        else if (tod == "am" && hours == 12){
            hours = 0;
        }

        this.minutes = minutes + hours * 60
    }

    subtractTime(subtractedTime) {
        this.minutes -= subtractedTime + 5
    }

    getTime(){
        const minutes = Math.floor(this.minutes % 60)
        const hours = Math.floor(this.minutes / 60)
        let type;
        if (hours >= 12) {
            type = 'pm'
        }
        else {
            type = 'am'
        }
        return `${hours}:${minutes} ${type}`;
    }
}