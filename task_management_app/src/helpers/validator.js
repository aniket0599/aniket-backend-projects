class validator{

    static validateTask(task, taskData)
    {
        if(task.hasOwnProperty("title") && task.hasOwnProperty("taskId") &&
        task.hasOwnProperty("description") && task.hasOwnProperty("isTaskCompleted") &&
        this.isNotEmpty(task) && this.isBoolean(task) &&
        this.validateUniqueTaskId(task, taskData))
        {
            return{
                "status" : true,
                "message": "A new Task has been created"
            };
        }

        if(!this.validateUniqueTaskId(task, taskData)){
            return {
                "status": false,
                "message": "A task with same 'taskId' already exists"
            };
        }

        if(!this.isNotEmpty(task)){
            return{
                "status": false,
                "message": "Title or Description of a task cannot be empty"
            }
        }

        if(!this.isBoolean(task)){
            return {
                "status": false,
                "message": "isTaskCompleted only accepts true or false as valid parameters"
            }
        }

        return{
            "status": false,
            "message": "One or more Task Details are invalid. Please check and try again"
        }
    }

    static validateUpdateTask(task)
    {
        if(task.hasOwnProperty("title") && task.hasOwnProperty("taskId") &&
        task.hasOwnProperty("description") && task.hasOwnProperty("isTaskCompleted") &&
        this.isNotEmpty(task) && this.isBoolean(task) )
        {
            return{
                "status" : true,
                "message": "Task Updated Successfully"
            };
        }

        if(!this.isNotEmpty(task)){
            return{
                "status": false,
                "message": "Title or Description of a task cannot be empty"
            }
        }

        if(!this.isBoolean(task)){
            return {
                "status": false,
                "message": "isTaskCompleted only accepts true or false as valid parameters"
            }
        }

        return{
            "status": false,
            "message": "One or more Task Details are invalid. Please check and try again"
        }

    }

    static validateUniqueTaskId(task, taskData){
        let isTaskExists = taskData.Tasks.some(val => val.taskId === task.taskId);
        if(isTaskExists)
            return false;
        return true;
    }
    static isNotEmpty(task){
        if(task.title !== '' && task.description !== '')
            return true;
        return false;
    }
    static isBoolean(task){
        let value = task.isTaskCompleted;
        if(typeof value === 'boolean')
            return true;
        return false;
    }
    
}
module.exports = validator;