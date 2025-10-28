
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
    public repeat: Appointment.Repeat | null; // allows a repeat to be set, or default to no repeat
    public transit_time: number; // set from a calculation, can be updated as needed.
    public transport_type: string; // string to pass to Google Maps API
    constructor(name: string, address: string, date: any, time: any, repeat: Appointment.Repeat | null, appointmentsList_function: React.Dispatch<React.SetStateAction<Appointment[]>>){
        this.name = name;
        this.address = address;
        this.date = date;
        this.time = time;
        if (repeat){
            // example declaration of a Repeat
            // const repeat: Appointment.Repeat = {
            //     days: ['mon','wed','fri'], // monday, wednesday, friday
            //     period: 1, // repeat every week
            // };
            this.repeat = repeat;
        }
        else
        {
            this.repeat = null;
        }
        this.transit_time = 10; // assume a 10 minute transit time for now
        this.transport_type = "walking"; // string to pass to Google Maps API

        // Overwrite previous list to now be the previous list with 1 more appointment at the end
        appointmentsList_function(prev => [...prev, this]);
    };

    getSummary(): string{
        return `${this.name} on ${this.date} at ${this.time} at ${this.address}`;
    }
    getAddress(): string{
        return this.address;
    }
};