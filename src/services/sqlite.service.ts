import { ReusableTask } from './../models/reusabletask.model';
import { Entry } from './../models/entry.model';
import { Goal } from './../models/goal.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from "@angular/core";
//import { Storage } from "@ionic/storage";
import { Task } from "../models/task.model";
import { Toast } from '@ionic-native/toast';

@Injectable()
export class SqliteService {

    //private storageKey: string = "task";

    //SQLite properties
    private dbName: string = "bulletjourn.db";
    private dbLocation: string = "default";

    //Array variables that hold the SQLite Table data.
    public tasks: Task[] = [];
    public goals: Goal[] = [];
    public entries: Entry[] = [];
    public reusableTasks: ReusableTask[] = [];

    constructor(private sqlite: SQLite, private toast: Toast) {}

    /* #region [Helper Functions] */

    /**
     * @desc Create/Open up the sqlite database to use.
     * @returns Promise<SQLiteObject>
     * @example this.connect().then((db: SQLiteObject) => { db.executesql() })
     */
    connect(): Promise<SQLiteObject> {
      return this.sqlite.create({
        name: this.dbName,
        location: this.dbLocation
      });
    }
    /* #endregion */

    /* #region [Entry Table Functions] */

    /**
     * @description Loads the data in the Entry table in the SQLite database into the entries[] array.
     * @returns Promise that resolves type Entry[] array.
     * @resolves Entry[]
     */
    loadAllEntries() {
        console.log("Entering loadEntries() ------------");
        return new Promise((resolve, reject) => {

          this.connect()
          .then((db: SQLiteObject) => {

            //Create the Entry table in the SQLite database.
            db.executeSql(`CREATE TABLE IF NOT EXISTS
                Entry(rowid INTEGER PRIMARY KEY,
                      date TEXT NOT NULL)`, {} as any)
            .then(res => {
                console.log("SQLite CREATE Results: ");
                console.log(res);
            })
            .catch(e => {
                console.log("SQLite CREATE Error: ", "background: #ea5959");
                console.log(e);
            });

            //Grab all Entry records in the SQLite table Entry.
            console.log("Executing SQL [SELECT * FROM Entry ORDER BY rowid DESC] :");
            db.executeSql('SELECT * FROM Entry ORDER BY rowid DESC', {} as any)
            .then(res => {
              console.log("Results: " + res);

              this.entries = []; //clear array

              for(var i=0; i < res.rows.length; i++) {
                this.entries.push({rowid: res.rows.item(i).rowid, date: res.rows.item(i).date});
              }
              console.log("Successfully pushed { " + res.rows.length + " } records into entries[] array.");
              resolve(this.entries);
            })
            .catch(e => {
              console.log("!! Error: ", "background: #ea5959");
              console.log(e);
            });

          })
          .catch(e => {
            console.log('!! Error: ');
            console.log(e);
          });

        });


    }

    addEntry() {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO Entry VALUES(NULL, date('now', 'localtime'))", {} as any)
          .then(res => {
            console.log("New Entry added");
            console.log(res);

            this.toast.show("New Entry added", '2000', 'bottom').subscribe(
              toast => {
                //console.log(toast);
              }
            );

            resolve("success");

          })
        })
        .catch(e => {
          console.log(e);
        });

      });

    }

    deleteEntry(rowid: number): Promise<{}> {

      return new Promise((resolve, reject) => {

        this.sqlite.create({
          name: this.dbName,
          location: this.dbLocation
        })
        .then((db: SQLiteObject) => {

          console.log("Executing SQL [DELETE FROM Entry WHERE rowid = " + rowid.toString() + "] :");
          db.executeSql('DELETE FROM Entry WHERE rowid = ?', [rowid])
          .then(res => {
            console.log("Results: ");
            console.log(res);
            const index = this.entries.findIndex(entry => entry.rowid === rowid);
            if(index !== -1) {
              this.entries.splice(index, 1);
            }
            resolve("success"); //success
          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
          });

        })
        .catch(e => {
          console.log("!! Error running SQL: ");
          console.log(e);
        });

      });


    }

    /**
     * @desc Checks to see if an entry already exists for the current day before adding a task.
     * @param date
     * @return Promise that resolves a boolean.
     * @resolve Boolean
     */
    checkIfEntryExists(date: string) {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {

          db.executeSql('SELECT * FROM Entry WHERE date = ?', [date])
          .then(res => {

            if(res.rows.length > 0) {
              resolve(true);
            }
            else {
              resolve(false);
            }

          })
          .catch(e => {
            console.log(e);
          });

        })
      });
    }
    /* #endregion */

    /* #region [Goal Table Functions] */
    /**
     * @description Load the data in the Goal table in the SQLite database into the goals[] array.
     */
    loadAllGoals() {
        console.log("Entering loadGoals() ------------");
        this.sqlite.create({
            name: this.dbName,
            location: this.dbLocation
        })
        .then((db: SQLiteObject) => {

            //Create the Goal table if it doesn't already exists
            db.executeSql(`CREATE TABLE IF NOT EXISTS
                Goal(rowid INTEGER PRIMARY KEY,
                     name TEXT,
                     desc TEXT,
                     amt_completed INTEGER DEFAULT 0)`, {} as any)
            .then(res => {
                console.log("Sqlite CREATE TABLE [Goal] results: ");
                console.log(res);
            })
            .catch(e => {
                console.log("!! Sqlite CREATE TABLE [Goal] error: ", "background: #ea5959");
                console.log(e);
            });

            //Grab all the goals in the sqlite db and store into an array
            console.log("Executing SQL [SELECT * FROM Goal ORDER BY rowid ASC] :");
            db.executeSql('SELECT * FROM Goal ORDER BY rowid DESC', {} as any)
            .then(res => {
                console.log("Results: " + res);

                this.goals = []; //clear goals array

                //loop through the results of the sql and push each record into goals[] array.
                for(var i=0; i < res.rows.length; i++) {
                    this.goals.push({rowid: res.rows.item(i).rowid,
                                     name: res.rows.item(i).name,
                                     desc: res.rows.item(i).desc,
                                     amt_completed: res.rows.item(i).amt_completed});
                }
                console.log("Successfully pushed { " + res.rows.length + " } records into goals[] array.");
            })
            .catch(e => {
                console.log("!! Error: " + e, "background: #ea5959");
            });


        })

    }
    /* #endregion */

    /* #region [ReusableTask Table Functions] */
    /**
     * @description Load the data in the ReusableTask table in SQLite database into the reusableTasks[] array.
     */
    loadAllReusableTasks() {
        this.sqlite.create({
            name: this.dbName,
            location: this.dbLocation
        })
        .then((db: SQLiteObject) => {1

            //Create the ReusableTask table if it doesn't already exist.
            db.executeSql(`CREATE TABLE IF NOT EXISTS
                ReusableTask(rowid INTEGER PRIMARY KEY,
                             name TEXT,
                             desc TEXT,
                             Goal_id NUMBER)`, {} as any)
            .then(res => {
                console.log("Sqlite CREATE TABLE [ReusableTask] results: ");
                console.log(res);
            })
            .catch(e => {
                console.log("!! Sqlite CREATE TABLE [ReusableTask] error: ", "background: #ea5959");
                console.log(e);
            });

            //Grab all the records from the ReusableTask table
            db.executeSql('SELECT * FROM ReusableTask ORDER BY name DESC', {} as any)
            .then(res => {
                console.log("Results: " + res);

                this.reusableTasks = []; //clear the array

                for(var i=0; i < res.rows.length; i++) {
                    this.reusableTasks.push({rowid: res.rows.item(i).rowid,
                                             name: res.rows.item(i).name,
                                             desc: res.rows.item(i).desc,
                                             Goal_id: res.rows.item(i).Goal_id});
                }
                console.log("Successfully pushed { " + res.rows.length + " } records into reusableTasks[] array.");
            })

        })

    }
    /* #endregion */

    /* #region [Task Table Functions] */
    /**
     * @description Load the data in the Task table in SQLite database into the task[] array.
     */
    loadAllTasks() {
        return this.sqlite.create({
            name: this.dbName,
            location: this.dbLocation
        })
        .then((db: SQLiteObject) => {

            //Create table Task if it does not already exists in the SQLite database.
            db.executeSql(`CREATE TABLE IF NOT EXISTS
                Task(rowid INTEGER PRIMARY KEY,
                     name TEXT,
                     desc TEXT,
                     completed INTEGER DEFAULT 0,
                     priority INTEGER,
                     Goal_id INTEGER,
                     Entry_id NOT NULL,
                     parent_Task_id INTEGER)`, {} as any)
            .then(res => {
                console.log("Sqlite CREATE TABLE [Task] results: ");
                console.log(res);
            })
            .catch(e => {
                console.log("!! Sqlite CREATE TABLE [Task] error: ", "background: #ea5959");
                console.log(e);
            });

            return db.executeSql('SELECT * FROM Task ORDER BY rowid DESC', {} as any)
            .then(res => {

                this.tasks = []; //clear the array

                //loop through the SQL results and push to the tasks[] array.
                for(var i=0; i < res.rows.length; i++) {
                    this.tasks.push({rowid: res.rows.item(i).rowid,
                                     name: res.rows.item(i).name,
                                     desc: res.rows.item(i).desc,
                                     completed: res.rows.item(i).completed,
                                     priority: res.rows.item(i).priority,
                                     Goal_id: res.rows.item(i).Goal_id,
                                     Entry_id: res.rows.item(i).Entry_id,
                                     parent_Task_id: res.rows.item(i).parent_Task_id});
                }

                console.log("Successfully pushed { " + res.rows.length + " } records into tasks[] array.");
            })
        })
    }

    addTask(task: Task) {

      return this.sqlite.create({
        name: this.dbName,
        location: this.dbLocation
      })
      .then((db: SQLiteObject) => {
        console.log("Executing SQL [INSERT INTO Task VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)] ....");

        return db.executeSql("INSERT INTO Task VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)",
                      [task.name, task.desc, task.completed, task.priority, task.Goal_id, task.Entry_id, task.parent_Task_id])
        .then(res => {
          console.log("SQL Results: ");
          console.log(res);
        })
        .catch(e => {
          console.log("!! SQL Error: ");
          console.log(e);
        });

      })
      .catch(e => {
        console.log("!! addTask() sqlite.create error: ");
        console.log(e);
      });

    }
    /* #endregion */

}
