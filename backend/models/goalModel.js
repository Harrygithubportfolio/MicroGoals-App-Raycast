const mongoose = require('mongoose');

const microGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  isDone: { type: Boolean, default: false },
  dueDate: Date,
  estimatedTime: String,
  difficulty: String,
  order: { type: Number, default: 0 }
});

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  targetDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  microGoals: [microGoalSchema],
  createdAt: { type: Date, default: Date.now },
  metadata: {
    difficulty: String,
    timeAvailable: String,
    priority: String,
    goalType: String
  },
  progress: {
    percentComplete: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.model('Goal', goalSchema);