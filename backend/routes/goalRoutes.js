const express = require('express');
const router = express.Router();
const Goal = require('../models/goalModel');
const AnthropicService = require('../services/anthropicService');

// Get all goals for a user
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.query.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single goal
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const goal = new Goal({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      targetDate: req.body.targetDate,
      user: req.body.userId
    });
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate microgoals using AI
router.post('/breakdown', async (req, res) => {
  try {
    const anthropicService = new AnthropicService(process.env.ANTHROPIC_API_KEY);
    const microGoals = await anthropicService.breakdownGoal(req.body.goalDetails);
    
    // Update the goal with the generated microgoals
    if (req.body.goalDetails.goalId) {
      const goal = await Goal.findById(req.body.goalDetails.goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      goal.microGoals = microGoals;
      await goal.save();
    }
    
    res.json(microGoals);
  } catch (error) {
    console.error('Error in goal breakdown:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a microgoal
router.patch('/microgoal/:goalId/:microgoalId', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const microgoal = goal.microGoals.id(req.params.microgoalId);
    if (!microgoal) {
      return res.status(404).json({ message: 'Microgoal not found' });
    }
    
    if (req.body.title) microgoal.title = req.body.title;
    if (req.body.description) microgoal.description = req.body.description;
    if (req.body.isDone !== undefined) microgoal.isDone = req.body.isDone;
    if (req.body.dueDate) microgoal.dueDate = req.body.dueDate;
    
    await goal.save();
    res.json(microgoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    await Goal.deleteOne({ _id: req.params.id });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;