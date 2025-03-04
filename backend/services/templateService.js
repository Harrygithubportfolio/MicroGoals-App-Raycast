class TemplateService {
  breakdownGoal(goalDetails) {
    // Select template based on goal type and category
    const template = this.getTemplateForGoal(goalDetails);
    
    // Personalize the template with goal details
    return this.customizeTemplate(template, goalDetails);
  }
  
  getTemplateForGoal(goalDetails) {
    // Get base template for goal type
    const baseTemplate = this.goalTypeTemplates[goalDetails.goalType] || this.goalTypeTemplates['achievement'];
    
    // Further refine by category if available
    if (goalDetails.category && this.categoryRefinements[goalDetails.category]) {
      return this.refineTemplateByCategory(baseTemplate, goalDetails.category);
    }
    
    return baseTemplate;
  }
  
  customizeTemplate(template, goalDetails) {
    // Make a deep copy of the template
    const customizedGoals = JSON.parse(JSON.stringify(template));
    
    // Customize titles and descriptions with the goal details
    return customizedGoals.map(goal => {
      // Replace placeholders in titles and descriptions
      goal.title = goal.title.replace('{GOAL}', goalDetails.title);
      goal.description = goal.description.replace('{GOAL}', goalDetails.title);
      
      if (goalDetails.description) {
        goal.description = goal.description.replace('{DESCRIPTION}', goalDetails.description);
      }
      
      return goal;
    });
  }
  
  // Templates organized by goal type
  goalTypeTemplates = {
    'habit': [
      { title: "Research best practices for {GOAL}", description: "Find articles, videos, or books about establishing this habit successfully", estimatedTime: "30min", difficulty: "Easy", order: 1 },
      { title: "Define your specific habit routine", description: "Write out exactly what your {GOAL} habit will look like day-to-day", estimatedTime: "20min", difficulty: "Medium", order: 2 },
      { title: "Set up a tracking system", description: "Create a habit tracker for {GOAL} in your preferred app or notebook", estimatedTime: "15min", difficulty: "Easy", order: 3 },
      { title: "Identify potential obstacles", description: "List what might get in the way of your {GOAL} habit", estimatedTime: "20min", difficulty: "Medium", order: 4 },
      { title: "Create environmental triggers", description: "Set up reminders or cues in your environment for {GOAL}", estimatedTime: "25min", difficulty: "Medium", order: 5 },
      { title: "Practice habit for first time", description: "Complete {GOAL} once and note what worked and what didn't", estimatedTime: "30min", difficulty: "Medium", order: 6 },
      { title: "Establish accountability", description: "Tell a friend or family member about your {GOAL} commitment", estimatedTime: "15min", difficulty: "Easy", order: 7 },
      { title: "Design a reward system", description: "Create meaningful rewards for sticking with {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 8 }
    ],
    
    'learning': [
      { title: "Define learning objectives for {GOAL}", description: "Write specific, measurable outcomes for what you want to learn", estimatedTime: "30min", difficulty: "Medium", order: 1 },
      { title: "Research learning resources", description: "Find the best books, courses, videos or mentors for {GOAL}", estimatedTime: "45min", difficulty: "Medium", order: 2 },
      { title: "Create a learning schedule", description: "Set up regular time blocks dedicated to {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 3 },
      { title: "Set up note-taking system", description: "Prepare a method to document what you learn about {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 4 },
      { title: "Complete first learning session", description: "Go through your first structured study session for {GOAL}", estimatedTime: "60min", difficulty: "Medium", order: 5 },
      { title: "Create practice exercises", description: "Design ways to actively practice what you're learning about {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 6 },
      { title: "Find a study partner or community", description: "Connect with others learning similar material to {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 7 },
      { title: "Schedule review sessions", description: "Plan regular reviews to reinforce your {GOAL} learning", estimatedTime: "15min", difficulty: "Easy", order: 8 }
    ],
    
    'project': [
      { title: "Define project scope for {GOAL}", description: "Clearly define what's included and not included in your project", estimatedTime: "45min", difficulty: "Medium", order: 1 },
      { title: "Break down main components", description: "List the major parts or phases needed to complete {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 2 },
      { title: "Create project timeline", description: "Establish deadlines for each component of {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 3 },
      { title: "Identify required resources", description: "List all tools, materials, and help needed for {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 4 },
      { title: "Set up project management", description: "Create a system to track progress on {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 5 },
      { title: "Complete first project task", description: "Finish the first actionable item for {GOAL}", estimatedTime: "60min", difficulty: "Medium", order: 6 },
      { title: "Plan for obstacles", description: "Identify potential issues and create contingency plans for {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 7 },
      { title: "Schedule regular reviews", description: "Set up times to review progress and adjust plans for {GOAL}", estimatedTime: "15min", difficulty: "Easy", order: 8 }
    ],
    
    'achievement': [
      { title: "Research success factors for {GOAL}", description: "Learn what leads to success for this type of goal", estimatedTime: "45min", difficulty: "Medium", order: 1 },
      { title: "Set measurable milestones", description: "Create checkpoints to track progress toward {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 2 },
      { title: "Identify required skills", description: "List skills you need to develop to achieve {GOAL}", estimatedTime: "30min", difficulty: "Easy", order: 3 },
      { title: "Create detailed action plan", description: "Map out specific steps to achieve {GOAL}", estimatedTime: "45min", difficulty: "Medium", order: 4 },
      { title: "Gather necessary resources", description: "Collect tools, materials, or information needed for {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 5 },
      { title: "Complete first milestone task", description: "Finish the first concrete action toward {GOAL}", estimatedTime: "60min", difficulty: "Medium", order: 6 },
      { title: "Establish accountability system", description: "Set up ways to stay accountable to {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 7 },
      { title: "Create tracking mechanism", description: "Build a way to measure your progress toward {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 8 }
    ]
  };
  
  // Category-specific refinements
  categoryRefinements = {
    'fitness': [
      { title: "Research fitness techniques for {GOAL}", description: "Find proper form and methods for your fitness goal", estimatedTime: "30min", difficulty: "Medium", order: 1 },
      { title: "Create a workout schedule", description: "Plan which days and times you'll work on {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 2 },
      { title: "Set up tracking metrics", description: "Decide how you'll measure progress on {GOAL}", estimatedTime: "15min", difficulty: "Easy", order: 3 },
      { title: "Prepare workout environment", description: "Set up the space or equipment you need for {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 4 },
      { title: "Complete first workout", description: "Do your first session focused on {GOAL}", estimatedTime: "45min", difficulty: "Medium", order: 5 },
      { title: "Plan nutrition support", description: "Research and plan nutrition to support your {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 6 },
      { title: "Schedule rest days", description: "Plan appropriate recovery for {GOAL}", estimatedTime: "15min", difficulty: "Easy", order: 7 },
      { title: "Create progress tracking", description: "Set up a system to record your improvements toward {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 8 }
    ],
    
    'financial': [
      { title: "Research best practices for {GOAL}", description: "Learn expert strategies related to your financial goal", estimatedTime: "45min", difficulty: "Medium", order: 1 },
      { title: "Analyze current financial situation", description: "Review your current status related to {GOAL}", estimatedTime: "60min", difficulty: "Hard", order: 2 },
      { title: "Set specific numerical targets", description: "Define exact numbers and deadlines for {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 3 },
      { title: "Create tracking spreadsheet", description: "Build a system to monitor progress on {GOAL}", estimatedTime: "45min", difficulty: "Medium", order: 4 },
      { title: "Identify necessary adjustments", description: "Determine what changes are needed to achieve {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 5 },
      { title: "Implement first financial change", description: "Make the first concrete change toward {GOAL}", estimatedTime: "30min", difficulty: "Medium", order: 6 },
      { title: "Schedule regular reviews", description: "Set up times to check progress on {GOAL}", estimatedTime: "15min", difficulty: "Easy", order: 7 },
      { title: "Create accountability system", description: "Set up ways to stay on track with {GOAL}", estimatedTime: "20min", difficulty: "Easy", order: 8 }
    ]
  };
  
  refineTemplateByCategory(baseTemplate, category) {
    // For simplicity here, we're just replacing the template completely
    // In a more sophisticated version, you could merge or selectively replace items
    return this.categoryRefinements[category] || baseTemplate;
  }
}

module.exports = TemplateService;