const Task= require('../models/Task');

const createTask=async(req,res) => {
  try{
    const{title,description,deadline,priority} =req.body;
    const newTask= new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user.id
    });

    await newTask.save();
    res.status(201).json({message: "Task created successfully",task: newTask});

  }catch(error){
    res.status(500).json({message: "Server error", error:error.message});
  }
};

const getTasks=async(req, res) => {
  try{
    const tasks=await Task.find({user: req.user.id});

    res.status(200).json({tasks});
  }catch(error){
    res.status(500).json({message: "Server error" , error: error.message});
  }
};

const updateTask= async(req,res)=> {
  try{
    const taskId=req.params.id;
    const task=await Task.findOne({_id: taskId, user:req.user.id});
    
    if(!task){
      return res.status(404).json({message: "Task not found"});
    }
    Object.assign(task,req.body);

    await task.save();
    res.status(200).json({message: "Task updated successfully",task});
  }catch(error){
    res.status(500).json({message: "Server error",error:error.message});
  }
};

const deleteTask =async (req,res) => {
  try{
    const taskId=req.params.id;
    const task=await Task.findOneAndDelete({_id: taskId, user:req.user.id});

    if(!task){
      return res.status(404).json({message: "Task not found"});
    }
s
    res.status(200).json({message:"Task deleted successfully"});
  }catch(error){
    res.status(500).json({message:"Server error",error: error.message});
  }
};

module.exports={createTask ,getTasks,updateTask,deleteTask};