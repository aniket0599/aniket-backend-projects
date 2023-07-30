const taskRoutes = require('express').Router();
const taskData = require('../tasks.json');
const validator = require('../helpers/validator');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");

taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());

taskRoutes.get("/", (req, res) => {
    res.status(200);
    res.send(taskData);
});

taskRoutes.get("/:taskId", (req, res) => {
    let tasks = taskData.Tasks;
    let taskIdPassed = req.params.taskId;
    let result = (tasks || []).filter(task => task.taskId == taskIdPassed);
    if(result == null || result.length == 0 || result == undefined){
        return res.status(404).json({"message": "This task does not exist"});
    }
    res.status(200);
    res.send(result);
});

taskRoutes.post("/", (req, res) => {
    const newTask = req.body;

    if(validator.validateTask(newTask, taskData).status)
    {
        let writePath = path.join(__dirname, "..", "tasks.json");
        let taskDataModified = JSON.parse(JSON.stringify(taskData));
        taskDataModified.Tasks.push(newTask);
        try{
            fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'});
            return res.status(200).json(validator.validateTask(newTask, taskData));
        }
        catch (err){
            return res.status(500).json({"message": "Failed to write"});
        }  
    }
    else
    {
        console.log(res.json(validator.validateTask(newTask, taskData)));
        return res.status(400).json(validator.validateTask(newTask, taskData));
    }
});

taskRoutes.put("/:taskId", (req, res) => {

    let tasks = taskData.Tasks;
    let taskIdPassed = req.params.taskId;
    let result = (tasks || []).filter(task => task.taskId == taskIdPassed);
    if(result == null || result.length == 0 || result == undefined){
        return res.status[400].json({"message": "This task does not exist"});
    }

    const updateTask = req.body;

    if(validator.validateUpdateTask(updateTask).status)
    {           
        let writePath = path.join(__dirname, "..", "tasks.json");
        let taskDataModified = taskData;

        const updatedTask = tasks.map(task => task.taskId == taskIdPassed ? {...task,...updateTask}:task);
        try{
            taskDataModified.Tasks = updatedTask;
            fs.writeFileSync(writePath, JSON.stringify(taskDataModified));
            return res.status(200).json(validator.validateUpdateTask(updateTask));
        }
        catch (err){
            return res.status(500).json({"message": "Failed to update"});
        }  
    }
    else
    {
        return res.status(400).json(validator.validateUpdateTask(updateTask));
    }
});

taskRoutes.delete("/:taskId", (req, res) => {
    let tasks = taskData.Tasks;
    let taskIdPassed = req.params.taskId;
    let result = (tasks || []).filter(task => task.taskId == taskIdPassed);
    if(result == null || result.length == 0 || result == undefined){
        return res.status(404).json({"message": "This task does not exist"});
    }

    let writePath = path.join(__dirname, "..", "tasks.json");
    let taskDataModified = taskData;
    const index = tasks.findIndex(task => task.taskId == taskIdPassed);
    tasks.splice(index, 1);

    try{
        taskDataModified.Tasks = tasks;
        fs.writeFileSync(writePath, JSON.stringify(taskDataModified));
        return res.status(200).json({"message":"User Deleted Successfully",tasks});
    }
    catch (err){
        return res.status(500).json({"message": "Failed to Delete"});
    }  
});


module.exports = taskRoutes;
