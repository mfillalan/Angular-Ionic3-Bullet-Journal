/*
import { SqliteService } from './sqlite.service';
import { Task } from "../models/task.model";

export class TaskService {

  public tasks: Task[] = [];

  constructor(private sqlite: SqliteService) {}

  addItem(item: Task, date: Date) {

    this.sqlite.checkIfEntryExists(date).then((exists: boolean) => {
      if(!exists) {

        this.sqlite.addEntry(date).then((entryId: number) => {
          //set the entry id of the new entry created to the task.
          item.Entry_id = entryId;
          //add the task to the sqlite database.
          this.sqlite.addTask(item).then((task: Task) => {
            this.tasks.push(task);
          })
          .catch(e => {
            console.log(e);
          });

        })
        .catch(e => {
          console.log(e);
        });
      }
      else {
        this.sqlite.getEntryRowId(date).then((entryId: number) => {

          item.Entry_id = entryId;

          this.sqlite.addTask(item).then((task: Task) => {
            this.tasks.push(task);
          });
        })
        .catch(e => {
          console.log(e);
        });
      }
    })
    .catch(e => {
      console.log(e);
    });

  }

  addItems(items: Task[], date: Date) {

    this.sqlite.checkIfEntryExists(date).then((exists: boolean) => {

      if(!exists) {
        this.sqlite.addEntry(date).then((entryId: number) => {

          for(var i=0; i < items.length; i++) {
            items[i].Entry_id = entryId;
            this.sqlite.addTask(items[i]).then((task: Task) => {
              this.tasks.push(task);
            })
            .catch(e => {
              console.log(e);
            });
          }

        });
      }
      else {
        this.sqlite.getEntryRowId(date).then((entryId: number) => {

          for(var i=0; i < items.length; i++) {
            items[i].Entry_id = entryId;
            this.sqlite.addTask(items[i]).then((task: Task) => {
              this.tasks.push(task);
            })
            .catch(e => {
              console.log(e);
            });
          }

        })
        .catch(e => {
          console.log(e);
        });
      }

    })
    .catch(e => {
      console.log(e);
    });

  }

  deleteItem(rowid: number) {

    this.sqlite.deleteTask(rowid).then((rRowId: number) => {

      //find the position the task is in the array searching for the rowid
      const index = this.tasks.findIndex(task => task.rowid === rRowId);
      if(index !== -1) {
        this.tasks.splice(index, 1);
        console.log("Removed Task with rowid: " + rRowId + " from tasks[].")
      }
      else {
        console.log("!! Could not find task with rowid: " + rRowId + " in tasks[].");
      }

    })
    .catch(e => {
      console.log(e);
    });

  }

  getItems(): Task[] {
    return this.tasks.slice();
  }

  getAllItems() {
    this.sqlite.loadAllTasks().then((tasks: Task[]) => {
      this.tasks = tasks;
    })
    .catch(e => {
      console.log(e);
    });
  }

  getItemsByEntryId(entryId: number) {

    this.sqlite.getTasksByEntryId(entryId).then((tasks: Task[]) => {
      this.tasks = tasks;
    })
    .catch(e => {
      console.log(e);
    });

  }

}
*/
