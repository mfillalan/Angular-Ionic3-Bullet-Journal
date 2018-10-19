export class Goal {
    constructor(
        public rowid: number,
        public name: string,
        public desc: string,
        public amt_completed: number
    ) {}
}