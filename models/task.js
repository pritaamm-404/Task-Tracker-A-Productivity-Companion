// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description:{ type: String, required: true },
  priority: { type: String,  enum: ['Low', 'Medium', 'High'], default: 'Low' },
  dueDate: Date,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  category: { type: String,  default: 'Personal' },
});


export default mongoose.model('Task', taskSchema);
// module.exports = mongoose.model('Task', taskSchema);
