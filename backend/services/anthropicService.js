// backend/services/anthropicService.js
const axios = require('axios');

class AnthropicService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
  }

  async breakdownGoal(goalDetails) {
    try {
      // Create a more detailed, context-aware prompt
      const prompt = this.createPrompt(goalDetails);

      const response = await axios.post(this.baseURL, {
        model: "claude-3-5-sonnet-20240620",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000
      }, {
        headers: {
          'anthropic-version': '2023-06-01',
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      return this.parseGoalBreakdown(response.data, goalDetails);
    } catch (error) {
      console.error('Goal breakdown error:', error);
      
      // Return some default microgoals if API call fails
      return this.createDefaultMicrogoals(goalDetails);
    }
  }

  createPrompt(goalDetails) {
    return `
You are an expert goal achievement coach and productivity specialist. You help people break down big goals into actionable micro-goals.

I need your help breaking down the following macro goal into specific, actionable micro-goals that are sequenced in a logical order.

## GOAL DETAILS
Title: ${goalDetails.title}
Description: ${goalDetails.description || 'No description provided'}
Category: ${goalDetails.category || 'General'}
Target Date: ${goalDetails.targetDate || 'Not specified'}
Difficulty: ${goalDetails.difficulty || 'Medium'}
Time Available: ${goalDetails.timeAvailable || 'Medium (5-10 hours/week)'}
Priority: ${goalDetails.priority || 'Medium'}
Goal Type: ${goalDetails.goalType || 'Achievement'}

## REQUIREMENTS FOR MICRO-GOALS
1. Create 5-12 specific micro-goals that build toward the macro goal
2. Each micro-goal should be achievable in a single session (15-90 minutes)
3. Arrange them in sequential order (what needs to happen first, second, etc.)
4. Include a mix of research, planning, execution, and evaluation tasks
5. For each micro-goal, provide:
   - A clear, action-oriented title (starts with a verb)
   - A brief description that explains what to do and why it matters
   - Estimated time to complete (15min, 30min, 45min, 60min, 90min)
   - Difficulty (Easy, Medium, Hard)

Format your response as a structured JSON array where each object represents a micro-goal with these properties:
- title (string)
- description (string)
- estimatedTime (string)
- difficulty (string)
- order (number)

Don't include any explanations or text before or after the JSON array.
`;
  }

  parseGoalBreakdown(aiResponse, goalDetails) {
    try {
      const content = aiResponse.content[0].text;
      
      // Try to parse JSON directly from the response
      let microGoals = [];
      
      // Find JSON array in the response (look for anything between [ and ])
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          microGoals = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Error parsing JSON from AI response:', e);
        }
      }
      
      // If JSON parsing failed, fall back to parsing list items
      if (microGoals.length === 0) {
        microGoals = this.parseListItems(content);
      }
      
      // Add isDone property to all microgoals
      microGoals = microGoals.map(goal => ({
        ...goal,
        isDone: false
      }));
      
      return microGoals.length > 0 ? microGoals : this.createDefaultMicrogoals(goalDetails);
    } catch (error) {
      console.error('Error parsing goal breakdown:', error);
      return this.createDefaultMicrogoals(goalDetails);
    }
  }

  parseListItems(content) {
    // Parse list items if JSON parsing fails
    const microGoalsRaw = content.split('\n').filter(line => 
      line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().match(/^\d+\./)
    );
    
    return microGoalsRaw.map((goal, index) => {
      const goalText = goal.replace(/^[-*\d.]\s+/, '').trim();
      
      // Check if there's a description (separated by ":")
      let title = goalText;
      let description = '';
      
      if (goalText.includes(':')) {
        const parts = goalText.split(':');
        title = parts[0].trim();
        description = parts[1].trim();
      }
      
      return {
        title: title,
        description: description,
        estimatedTime: '30min',
        difficulty: 'Medium',
        order: index + 1
      };
    });
  }

  createDefaultMicrogoals(goalDetails) {
    // Generate sensible defaults based on the goal type
    const defaults = {
      'habit': [
        { title: "Research habit formation techniques", description: "Learn about habit stacking, triggers, and rewards", estimatedTime: "30min", difficulty: "Easy", order: 1 },
        { title: "Set up tracking system", description: "Create a way to track your progress daily", estimatedTime: "30min", difficulty: "Easy", order: 2 },
        { title: "Identify potential obstacles", description: "List what might get in your way and plan solutions", estimatedTime: "30min", difficulty: "Medium", order: 3 },
        { title: "Create reminder system", description: "Set up cues that will remind you to perform the habit", estimatedTime: "15min", difficulty: "Easy", order: 4 },
        { title: "Perform habit first time", description: "Complete the habit once and reflect on the experience", estimatedTime: "30min", difficulty: "Medium", order: 5 }
      ],
      'learning': [
        { title: "Define learning objectives", description: "Clearly outline what you want to learn and why", estimatedTime: "30min", difficulty: "Medium", order: 1 },
        { title: "Research learning resources", description: "Find books, courses, videos, or mentors", estimatedTime: "45min", difficulty: "Medium", order: 2 },
        { title: "Create study schedule", description: "Plan when and how you'll learn", estimatedTime: "30min", difficulty: "Easy", order: 3 },
        { title: "Complete first learning session", description: "Study the basics and take notes", estimatedTime: "60min", difficulty: "Medium", order: 4 },
        { title: "Test your understanding", description: "Create a quiz or explanation to check comprehension", estimatedTime: "30min", difficulty: "Medium", order: 5 }
      ],
      'project': [
        { title: "Define project scope", description: "Clearly outline what's included and not included", estimatedTime: "45min", difficulty: "Medium", order: 1 },
        { title: "Break down major components", description: "List the main parts of the project", estimatedTime: "30min", difficulty: "Medium", order: 2 },
        { title: "Create timeline", description: "Map out deadlines for each component", estimatedTime: "30min", difficulty: "Medium", order: 3 },
        { title: "Gather resources", description: "Collect tools, materials, or information needed", estimatedTime: "60min", difficulty: "Medium", order: 4 },
        { title: "Complete first project task", description: "Finish the first concrete action", estimatedTime: "60min", difficulty: "Medium", order: 5 }
      ],
      'achievement': [
        { title: "Research success factors", description: "Learn what leads to success for this type of goal", estimatedTime: "45min", difficulty: "Medium", order: 1 },
        { title: "Set measurable milestones", description: "Create checkpoints to track progress", estimatedTime: "30min", difficulty: "Medium", order: 2 },
        { title: "Identify required skills", description: "List skills you need to develop", estimatedTime: "30min", difficulty: "Easy", order: 3 },
        { title: "Create action plan", description: "Map out specific steps to take", estimatedTime: "45min", difficulty: "Medium", order: 4 },
        { title: "Complete first milestone task", description: "Finish the first concrete action", estimatedTime: "60min", difficulty: "Medium", order: 5 }
      ]
    };
    
    // Return the appropriate default set or a generic one
    return defaults[goalDetails.goalType] || defaults['achievement'];
  }
}

module.exports = AnthropicService;