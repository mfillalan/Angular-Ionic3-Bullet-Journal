export class Task {
    constructor(public rowid: number,
                public name: string,
                public desc: string,
                public completed: number,
                public priority: number,
                public parent_Task_id: number,
                public Entry_id: number,
                public Goal_id: number,
                public icon: string,
                public color: string
                ) {}
}
