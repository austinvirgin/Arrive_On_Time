import { getApiKey } from "./api.js";

async function apiKeyCall() {

    // Get the api key from the hidden file
    return await getApiKey()
}

async function getETA(origin, destination, transportation_type = 'walking', key) {
    // const mode = mapMode(transportation_type)

    // Create parameters for the seach
    const params = new URLSearchParams({

        // Get the origin
        origins: `${origin} rexburg`,

        // Get the destination
        destinations: `${destination} rexburg`,

        // Give the transportation type and the key
        mode: transportation_type,
        key
    })

    // Pull the results and make it text
    let result = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params}`);
    const text = await result.text();

    // Make it into JSON
    const data = JSON.parse(text)

    // Get the value of the duration
    const seconds = data.rows[0].elements[0].duration.value;

    // Switch it into minutes
    return seconds / 60
}

export async function calculateTime(origin, destination, transportation_type, appointmentTime, appointmentPeriod = "pm", extra_time = "5") {

    // Add the appointment time and the appointment period
    appointmentTime = `${appointmentTime} ${appointmentPeriod}`

    // Make sure the api is ready to go
    let api = await apiKeyCall()

    // Make a time class
    let time = new Time(appointmentTime)

    // Get the ETA and wait for it to be done
    let minutes = await getETA(origin, destination, transportation_type, api)

    // Subtract the eta from the time
    time.subtractTime(minutes, extra_time)

    // Return the new time
    return time.getTime(appointmentTime);
}

class Time{

    constructor(time){

        // Split the hours from the minutes and time of day
        let [ hours, minutes_tod ] = time.split(":");

        // Make the hours into a number
        hours = Number(hours)

        // Split the minutes and the time of day
        let [minutes, tod] = minutes_tod.split(" ")

        // Switch the minutes into a number
        minutes = Number(minutes)

        if (hours > 12){
            // Switch millitary time into 12 base
            hours -= 12

            // Make sure the time of day is pm
            tod = "pm"
        }

        if (tod === "pm" && hours !== 12){
            // console.log(`${hours}`)
            // Make the time into millitary time
            hours += 12;
        }
        if (tod === "am" && hours === 12){

            // If it is midnight make it the start of the day
            hours = 0;
        }

        // Make the time into minutes
        this.minutes = minutes + hours * 60
    }

    subtractTime(subtractedTime, extra_time) {

        // Subtract the time
        this.minutes -= subtractedTime + Number(extra_time)
        // console.log(this.minutes)
    }

    getTime(){

        // Make a smmall number that is nothing
        let small_num = ''

        // Get the amount of minutes
        const minutes = Math.floor(this.minutes % 60)

        // Add a 0 if the minutes is less than 10
        if (minutes < 10){
            small_num = "0"
        }

        // Get the amount of hours
        let hours = Math.floor(this.minutes / 60)

        // console.log(hours)

        let type;
        if (hours >= 12) {
            // Set the type to PM
            type = 'PM'
        }
        else {
            // Set the type to AM
            type = 'AM'
        }

        // console.log(hours)

        if (hours > 12){
            // Make the time into base 12
            hours = hours - 12
        }
        
        // Return the time in a readable way
        return `${hours}:${small_num}${minutes} ${type}`;
    }
}