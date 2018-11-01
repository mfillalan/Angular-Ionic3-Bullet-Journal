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

    createAllTables() {
      this.createEntryTable();
      this.createGoalTable();
      this.createReusableTaskTable();
      this.createTaskTable();
    }

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

    /**
     * @desc Takes a date and formats it into sqlite date.
     * @param date
     * @returns string, formatted date yyyy-mm-dd
     */
    dateToFormattedString(date: Date): string {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString();
      var dd = date.getDate().toString();

      return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    }
    /* #endregion */

    /* #region [Entry Table Functions] */

    /**
     * @desc Creates the Entry table in the sqlite database.
     * @returns Promise<boolean>
     * @resolves boolean
     */
    createEntryTable(): Promise<boolean> {

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
              resolve(true);
          })
          .catch(e => {
              console.log("SQLite CREATE Error: ", "background: #ea5959");
              console.log(e);
              reject("createEntryTable(): CREATE statement failed.");
          });

        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject("createEntryTable(): Failed to run.");
        });

      });

    }

    /**
     * @description Loads the data in the Entry table in the SQLite database into the entries[ ] array.
     * @returns Promise that resolves type Entry[ ] array.
     * @resolves Entry[ ]
     */
    loadAllEntries(): Promise<Entry[]> {
        console.log("Entering loadEntries() ------------");
        return new Promise((resolve, reject) => {

          this.connect()
          .then((db: SQLiteObject) => {



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
              reject("!! loadAllEntries() executeSql Failed.");
            });

          })
          .catch(e => {
            console.log('!! Error: ');
            console.log(e);
            reject("!! loadAllEntries() Failed.");
          });

        });


    }

    /**
     * @desc Adds an new record in the Entry table.
     * @returns Promise<number> as rowid
     * @resolves rowid: number
     */
    addEntry(date: Date): Promise<number> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO Entry VALUES(NULL, ?)", [this.dateToFormattedString(date)])
          .then(res => {
            console.log("New Entry added. InsertId: " + String(res.insertId));
            console.log(res);

            this.toast.show("New Entry added", '2000', 'bottom').subscribe(
              toast => {
                //console.log(toast);
              }
            );

            resolve(Number(res.insertId));

          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
            reject("addEntry() exectueSql failed.");
          });
        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject("addEntry() failed.");
        });

      });

    }

    /**
     * @desc
     * @param rowid
     * @returns Promise<Entry[ ]> updated entry array after removing the deleted row.
     * @resolves Entry[ ]
     */
    deleteEntry(rowid: number): Promise<Entry[]> {

      return new Promise((resolve, reject) => {

        this.connect()
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
            resolve(this.entries); //success
          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
            reject("!! deleteEntry() executeSql failed.");
          });

        })
        .catch(e => {
          console.log("!! Error running SQL: ");
          console.log(e);
          reject("!! deleteEntry() failed.");
        });

      });


    }

    /**
     * @desc Checks to see if an entry already exists for the current day before adding a task.
     * @param date
     * @return Promise that resolves a boolean.
     * @resolve Boolean
     */
    checkIfEntryExists(date: Date): Promise<boolean> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {

          db.executeSql('SELECT * FROM Entry WHERE date = ?', [this.dateToFormattedString(date)])
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

    /**
     * @desc Gets the rowid of the entry that matches the date that is given.
     * @param date
     * @returns Promise that resolves the rowid.
     * @resolves rowid: number, -1 is resolved if there are no results.
     */
    getEntryRowId(date: Date): Promise<number> {

      return new Promise((resolve, reject) => {
        this.connect()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM Entry WHERE date = ?', [this.dateToFormattedString(date)])
          .then(res => {
            if(res.rows.length > 0) {
              resolve(res.rows.item(0).rowid);
            }
            else {
              resolve(-1);
            }
          })
        })
      });

    }
    /* #endregion */

    /* #region [Goal Table Functions] */

    /**
     * @desc Create the Goal table in the sqlite database.
     * @returns Promise<boolean>
     * @resolves boolean
     */
    createGoalTable(): Promise<boolean> {

      return new Promise((resolve, reject) => {

        this.connect()
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
              resolve(true);
          })
          .catch(e => {
              console.log("!! Sqlite CREATE TABLE [Goal] error: ", "background: #ea5959");
              console.log(e);
              reject("createGoalTable(): CREATE statement failed.");
          });

        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject("createGoalTable(): Failed to run.");
        });

      });

    }

    /**
     * @description Load the data in the Goal table in the SQLite database into the goals[ ] array.
     * @returns Promise that resolves type Goal[ ].
     * @resolves Goal[ ]
     */
    loadAllGoals(): Promise<Goal[]> {
        console.log("Entering loadGoals() ------------");

        return new Promise((resolve, reject) => {

          this.connect()
          .then((db: SQLiteObject) => {

              //Grab all the goals in the sqlite db and store into an array
              console.log("Executing SQL [SELECT * FROM Goal ORDER BY rowid ASC] :");
              db.executeSql('SELECT * FROM Goal ORDER BY rowid DESC', {} as any)
              .then(res => {
                  console.log("Results: " + res);

                  this.goals = []; //clear goals array

                  //loop through the results of the sql and push each record into goals[ ] array.
                  for(var i=0; i < res.rows.length; i++) {
                      this.goals.push({rowid: res.rows.item(i).rowid,
                                      name: res.rows.item(i).name,
                                      desc: res.rows.item(i).desc,
                                      amt_completed: res.rows.item(i).amt_completed});
                  }
                  console.log("Successfully pushed { " + res.rows.length + " } records into goals[] array.");

                  resolve(this.goals);
              })
              .catch(e => {
                  console.log("!! Error: ", "background: #ea5959");
                  console.log(e);
                  reject("loadAllGoals(): SELECT Statement failed.");
              });


          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
            reject("loadAllGoals(): Failed to run.");
          });

        });



    }

    /* #endregion */

    /* #region [ReusableTask Table Functions] */

    /**
     * @desc Creates the reusableTask table in the sqlite database.
     * @returns Promise<boolean>
     * @resolves boolean
     */
    createReusableTaskTable(): Promise<boolean> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {

          //Create the ReusableTask table if it doesn't already exist.
          db.executeSql(`CREATE TABLE IF NOT EXISTS
              ReusableTask(rowid INTEGER PRIMARY KEY,
                          name TEXT,
                          desc TEXT,
                          Goal_id NUMBER)`, {} as any)
          .then(res => {
              console.log("Sqlite CREATE TABLE [ReusableTask] results: ");
              console.log(res);
              resolve(true);
          })
          .catch(e => {
              console.log("!! Sqlite CREATE TABLE [ReusableTask] error: ", "background: #ea5959");
              console.log(e);
              reject("createReusableTable(): CREATE statement failed.");
          });

        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject("createReusableTable(): Failed to run.");
        });

      });

    }

    /**
     * @description Load the data in the ReusableTask table in SQLite database into the reusableTasks[ ] array.
     * @returns Promise that resolves ReusableTask[ ].
     * @resolves ReusableTask[ ]
     */
    loadAllReusableTasks(): Promise<{}> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {

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

                resolve(this.reusableTasks);
            })

        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject(e);
        });

      });



    }
    /* #endregion */

    /* #region [Task Table Functions] */

    /**
     * @desc Create the Task table in the sqlite database.
     * @returns Promise<boolean>
     * @resolves boolean
     */
    createTaskTable(): Promise<boolean> {

      return new Promise((resolve, reject) => {
        this.connect()
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
              resolve(true);
          })
          .catch(e => {
              console.log("!! Sqlite CREATE TABLE [Task] error: ", "background: #ea5959");
              console.log(e);
              reject("createTaskTable() CREATE statement failed.");
          });

        })
        .catch(e => {
          console.log("!! error: ");
          console.log(e);
          reject("createTaskTable() failed.");
        });
      });

    }

    /**
     * @description Load the data in the Task table in SQLite database into the task[] array.
     * @returns Promise<Task[ ]>
     * @resolves Task[ ]
     */
    getAllTasks(): Promise<Task[]> {

      return new Promise((resolve, reject) => {
        this.connect()
        .then((db: SQLiteObject) => {

            db.executeSql('SELECT * FROM Task ORDER BY rowid DESC', {} as any)
            .then(res => {

                var tasks: Task[] = [];

                //loop through the SQL results and push to the tasks[] array.
                for(var i=0; i < res.rows.length; i++) {
                        tasks.push({rowid: res.rows.item(i).rowid,
                                    name: res.rows.item(i).name,
                                    desc: res.rows.item(i).desc,
                                    completed: res.rows.item(i).completed,
                                    priority: res.rows.item(i).priority,
                                    Goal_id: res.rows.item(i).Goal_id,
                                    Entry_id: res.rows.item(i).Entry_id,
                                    parent_Task_id: res.rows.item(i).parent_Task_id});
                }

                console.log("Successfully pushed { " + res.rows.length + " } records into tasks[] array.");

                this.tasks = tasks;
                resolve(tasks);
            })
            .catch(e => {
              console.log("!! Error: ");
              console.log(e);
              reject("loadAllTasks() SELECT statement failed.");
            });
        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
        })
      });

    }

    /**
     * @desc Add a new record to the Task table.
     * @param task
     * @returns Promise<Task>
     * @resolves task: Task
     */
    addTask(task: Task): Promise<Task> {

      return new Promise((resolve, reject) => {
        this.connect()
        .then((db: SQLiteObject) => {
          console.log("Executing SQL [INSERT INTO Task VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)] ....");

          db.executeSql("INSERT INTO Task VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)",
                        [task.name, task.desc, task.completed, task.priority, task.Goal_id, task.Entry_id, task.parent_Task_id])
          .then(res => {
            console.log("SQL Results: ");
            console.log(res);


            if(res.rowsAffected > 0) {
              console.log(res.insertId);

              this.getTaskByRowId(res.insertId).then((task: Task) => {
                //console.log("Task successfully added and pushed to tasks[] array.");

                resolve(task);
              })
              .catch(e => {
                console.log("!! Error: ");
                console.log(e);
                reject("addTask(): Problem adding task to task array.")
              });

            }
            else {
              reject("addTask(): INSERT statement did not insert any records.");
            }

          })
          .catch(e => {
            console.log("!! SQL Error: ");
            console.log(e);
            reject("addTask(): INSERT statement errored out.");
          });

        })
        .catch(e => {
          console.log("!! addTask() sqlite.create error: ");
          console.log(e);
        });
      });

    }

    /**
     * @desc Deletes a record with the provided rowid.
     * @param rowid
     * @returns Promise<number>
     * @resolves rowid: number
     */
    deleteTask(rowid: number): Promise<number> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {

          db.executeSql('DELETE FROM Task WHERE rowid = ?', [rowid])
          .then(res => {
            console.log("Deleted Task rowid: " + res.insertId);
            console.log("Number of rows affected: " + res.rowsAffected);

            resolve(res.insertId);
          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
            reject("deleteTask(): DELETE Statement failed.");
          });

        })
        .catch(e => {
          console.log("!! error: ");
          console.log(e);
          reject("deleteTask(): failed to complete.");
        });

      });

    }


    /**
     * @desc Get a single task record with the provided rowid.
     * @param rowid
     * @returns Promise<Task>
     * @resolves Task
     */
    getTaskByRowId(rowid: number): Promise<Task> {

      return new Promise((resolve, reject) => {

        this.connect()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM Task WHERE rowid = ?', [rowid])
          .then(res => {
            if(res.rows.length > 0) {
              var task: Task = new Task(res.rows.item(0).rowid,
              res.rows.item(0).name,
              res.rows.item(0).desc,
              res.rows.item(0).completed,
              res.rows.item(0).priority,
              res.rows.item(0).parent_Task_id,
              res.rows.item(0).Entry_id,
              res.rows.item(0).Goal_id);

              resolve(task);
            }
          })
          .catch(e => {
            console.log("!! Error: ");
            console.log(e);
            reject("getTaskByRowId(): SELECT statement failed.");
          });

        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
          reject("getTaskByRowId(): Failed to run.");
        });

      });
    }

    /**
     * @desc Gets all the tasks that are associated with the current Entry ID.
     * @param entryId
     * @returns Promise<Task[ ]>
     * @resolves Task[ ]
     */
    getTasksByEntryId(entryId: number): Promise<Task[]> {
      return new Promise((resolve, reject) => {
        this.connect()
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM Task WHERE Entry_id = ?', [entryId]).then(res => {
            if(res.rows.length > 0) {

              var tasks : Task[] = [];

              for(var i = 0; i < res.rows.length; i++) {
                tasks.push({
                  rowid: res.rows.item(i).rowid,
                  name: res.rows.item(0).name,
                  desc: res.rows.item(0).desc,
                  completed: res.rows.item(0).completed,
                  priority: res.rows.item(0).priority,
                  parent_Task_id: res.rows.item(0).parent_Task_id,
                  Entry_id: res.rows.item(0).Entry_id,
                  Goal_id: res.rows.item(0).Goal_id
                });
              }

              this.tasks = tasks;
              console.log("Successfully added ( " + res.rows.length + ") tasks to array.");
              resolve(tasks);

            }
          })
        })
        .catch(e => {
          console.log("!! Error: ");
          console.log(e);
        })
      });

    }

    getTasksByDate(date: Date): Promise<Task[]> {

      return new Promise((resolve, reject) => {

        this.getEntryRowId(date).then((entryId: number) => {

          this.getTasksByEntryId(entryId).then((tasks: Task[]) => {
            resolve(tasks);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });

        })
        .catch(e => {
          console.log(e);
          reject(e);
        });

      });

    }
    /* #endregion */

}
