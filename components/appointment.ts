export class Appointment{
    // everything public for now
    public name: string;
    public address: string;
    public date: string; // this may later be a specific dateTime instance or something related.
    public time: string;
    public repeat: string[]; // allows a repeat to be set
    public transit_time: number; // set from a calculation, can be updated as needed.
    public transport_type: string; // string to pass to Google Maps API
    constructor(name: string, address: string, date: string, time: string, repeat: string[]){//, appointmentsList_function: React.Dispatch<React.SetStateAction<Appointment[]>>){
        this.name = name;
        this.address = address;
        this.date = date;
        this.time = time;
        this.repeat = repeat; // an array of 3 letter days
        this.transit_time = 10; // assume a 10 minute transit time for now
        this.transport_type = "walking"; // string to pass to Google Maps API
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