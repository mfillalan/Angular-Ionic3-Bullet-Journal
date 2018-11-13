export class Task_Entry {
  constructor(public task_rowid: number,
              public task_name: string,
              public task_desc: string,
              public task_completed: number,
              public task_priority: number,
              public task_parent_Task_id: number,
              public task_Entry_id: number,
              public task_Goal_id: number,
              public task_icon: string,
              public task_color: string,
              public entry_rowid: number,
              public entry_date: string) {}
}
