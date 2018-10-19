import { ReusableTask } from './../models/reusabletask.model';
import { Entry } from './../models/entry.model';
import { Goal } from './../models/goal.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from "@angular/core";
//import { Storage } from "@ionic/storage";
import { Task } from "../models/task.model";

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

    constructor(private sqlite: SQLite) {}

    //#region [rgba(155, 89, 182, 0.15)]
    /**
     * @description Loads the data in the Entry table in the SQLite database into the entries[] array.
     */
    loadAllEntries() {
        console.log("Entering loadEntries() ------------");
        this.sqlite.create({
            name: this.dbName,
            location: this.dbLocation
        })
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
        })
    }
    //#endregion

    //#region [rgba(155, 89, 182, 0.15)]
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
    //#endregion

    //#region [rgba(155, 89, 182, 0.15)]
    /**
     * @description Load the data in the ReusableTask table in SQLite database into the reusableTasks[] array.
     */
    loadAllReusableTasks() {
        this.sqlite.create({
            name: this.dbName,
            location: this.dbLocation
        })
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
    //#endregion

    //#region [rgba(155, 89, 182, 0.15)]
    /**
     * @description Load the data in the Task table in SQLite database into the task[] array.
     */
    loadAllTasks() {
        this.sqlite.create({
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

            db.executeSql('SELECT * FROM Task ORDER BY rowid DESC', {} as any)
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
    //#endregion

}