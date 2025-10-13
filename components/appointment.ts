// Code to handle internally making components


export class Appointment{
    public name: string;
    public address: string;
    public date: any;
    public time: any;
    public repeat: boolean;
    public transit_time = 5.00;

    constructor(name: string, address: string, date: any, time: any, repeat: boolean){
        this.name = name;
        this.address = address;
        this.date = date;
        this.time = time;
        this.repeat = repeat;
        this.transit_time = 10; // 10 minute transit time for now
    };

    getSummary(): string{
        return `${this.name} on ${this.date} at ${this.time} at ${this.address}`;
    }
};

export default function CreateAppointment() {
    return new Appointment("test", "nowhere", 11, 11, false);
};