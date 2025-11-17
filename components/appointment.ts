export class Appointment{
    // everything public for now
    public name: string;
    public address: string;
    public date: string; // this may later be a specific dateTime instance or something related.
    public time: string;
    public repeat: string[]; // allows a repeat to be set
    public transit_time: string; // set from a calculation, can be updated as needed.
    public transport_type: string; // string to pass to Google Maps API
    constructor(name: string, address: string, date: any, time: any, eta: string, transport_type: string, repeat: string[]){
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
        this.transit_time = eta; // assume a 10 minute transit time for now
        this.transport_type = transport_type; // string to pass to Google Maps API

        // Overwrite previous list to now be the previous list with 1 more appointment at the end
        appointmentsList_function(prev => [...prev, this]);
    };

    // a string that contains relevant information about this appointment
    getSummary(): string{
        return `${this.name} at ${this.address} on ${this.date} at ${this.time}${this.repeat? " every " + this.repeat : ""}`;
    }

    // example of how to get a specific attribute from this class
    getAddress(): string{
        return this.address;
    }
};