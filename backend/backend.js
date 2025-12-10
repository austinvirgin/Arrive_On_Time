import { getApiKey } from "./api.js";

async function apiKeyCall() {
    return await getApiKey()
}

async function getETA(origin, destination, transportation_type = 'walking', key) {
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

export async function calculateTime(origin, destination, transportation_type, appointmentTime, appointmentPeriod = "PM", extra_time = "5") {
    appointmentTime = `${appointmentTime} ${appointmentPeriod}`
    console.log(`${origin} ${destination} ${transportation_type} ${appointmentTime}`);
    let api = await apiKeyCall()
    let time = new Time(appointmentTime)
    let minutes = await getETA(origin, destination, transportation_type, api)
    time.subtractTime(minutes, extra_time)
    return time.getTime(appointmentTime);
}

class Time{

    constructor(time){
        let [ hours, minutes_tod ] = time.split(":");
        hours = Number(hours)
        let [minutes, tod] = minutes_tod.split(" ")
        console.log(minutes_tod.split(" "))
        minutes = Number(minutes)
        if (hours > 12){
            tod = 'pm'
            hours -= 12
        }
        if (tod === "pm" && hours !== 12){
            console.log(`${hours}`)
            hours += 12;
        }
        if (tod == "am" && hours == 12){
            hours = 0;
        }

        this.minutes = minutes + hours * 60
    }

    subtractTime(subtractedTime, extra_time) {
        this.minutes -= subtractedTime + Number(extra_time)
    }

    getTime(){
        let small_num = ''
        const minutes = Math.floor(this.minutes % 60)
        if (minutes < 10){
            small_num = "0"
        }

        let hours = Math.floor(this.minutes / 60)

        console.log(hours)

        let type;
        if (hours >= 12) {
            type = 'pm'
        }
        else {
            type = 'am'
        }

        if (hours > 12){
            console.log(`${hours}${type}`)
            hours = hours - 12
        }
        
        return `${hours}:${small_num}${minutes} ${type}`;
    }
}