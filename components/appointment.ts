// Code to handle internally making components
export namespace Appointment{
    // using namespace above bundles this below type with the Appointment namespace
    export type Repeat =
    {
        days: string[], // mon,tue,wed,thu,fri,sat,sun
        period: number, // period between repeats: repeat every 1 week, or every 2 weeks, etc.
    }
}

export class Appointment{
    // everything public for now
    public name: string;
    public address: string;
    public date: any; // this may later be a specific dateTime instance or something related.
    public time: any;
    public repeat: Appointment.Repeat | null; // allows a repeat to be set
    public transit_time: number; // set from a calculation, can be updated as needed.
    public transport_type: string; // string to pass to Google Maps API
    constructor(name: string, address: string, date: any, time: any, repeat: Appointment.Repeat | null, appointmentsList_function: React.Dispatch<React.SetStateAction<Appointment[]>>){
        this.name = name;
        this.address = address;
        this.date = date;
        this.time = time;
        // example declaration of a Repeat
        // const repeat: Appointment.Repeat = {
        //     days: ['mon','wed','fri'], // monday, wednesday, friday
        //     period: 1, // repeat every week
        // };
        this.repeat = repeat;
        this.transit_time = 10; // assume a 10 minute transit time for now
        this.transport_type = "walking"; // string to pass to Google Maps API

        // Overwrite previous list to now be the previous list with 1 more appointment at the end
        appointmentsList_function(prev => [...prev, this]);
    };

    // a string that contains relevant information about this appointment
    getSummary(): string{
        return `${this.name} at ${this.address} on ${this.date} at ${this.time}${this.repeat? " every " + this.repeat.days.toString() : ""}`;
    }

    // example of how to get a specific attribute from this class
    getAddress(): string{
        return this.address;
    }
};