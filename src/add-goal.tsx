// src/add-goal.tsx
import { Form, ActionPanel, Action, showToast, Toast, getPreferenceValues, Icon } from "@raycast/api";
import { useState } from "react";
import axios from "axios";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const preferences = getPreferenceValues();
  const apiUrl = preferences.apiUrl || "http://localhost:3000/api";
  const userId = preferences.userId || "";
  
  async function handleSubmit(values: { 
    title: string; 
    description: string; 
    category: string;
    targetDate: Date;
    difficulty: string;
    timeAvailable: string;
    priority: string;
    goalType: string;
  }) {
    setIsLoading(true);
    
    try {
      console.log("Creating goal with:", values);
      
      // Create the goal
      const response = await axios.post(`${apiUrl}/goals`, {
        title: values.title,
        description: values.description,
        category: values.category,
        targetDate: values.targetDate.toISOString().split('T')[0],
        userId: userId,
        metadata: {
          difficulty: values.difficulty,
          timeAvailable: values.timeAvailable,
          priority: values.priority,
          goalType: values.goalType
        }
      });
      
      // Request AI breakdown with enhanced context
      await axios.post(`${apiUrl}/goals/breakdown`, {
        goalDetails: {
          title: values.title,
          description: values.description,
          category: values.category,
          targetDate: values.targetDate.toISOString().split('T')[0],
          difficulty: values.difficulty,
          timeAvailable: values.timeAvailable,
          priority: values.priority, 
          goalType: values.goalType,
          goalId: response.data._id,
          userId: userId
        }
      });
      
      await showToast({
        style: Toast.Style.Success,
        title: "Goal Created",
        message: "Goal has been created with AI-generated micro-goals!"
      });
      
    } catch (error) {
      console.error("Error creating goal:", error);
      
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Create Goal",
        message: "Please check your API connection and user ID."
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm 
            title="Create Goal" 
            onSubmit={handleSubmit} 
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Goal Title"
        placeholder="Enter your macro goal"
      />
      
      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Describe your goal in detail including any constraints, requirements, or context"
      />
      
      <Form.Dropdown id="category" title="Category" defaultValue="personal">
        <Form.Dropdown.Item value="personal" title="Personal" />
        <Form.Dropdown.Item value="fitness" title="Fitness" />
        <Form.Dropdown.Item value="career" title="Career" />
        <Form.Dropdown.Item value="education" title="Education" />
        <Form.Dropdown.Item value="financial" title="Financial" />
        <Form.Dropdown.Item value="project" title="Project" />
      </Form.Dropdown>
      
      <Form.Dropdown id="difficulty" title="Difficulty Level" defaultValue="medium">
        <Form.Dropdown.Item value="easy" title="Easy - Straightforward task" />
        <Form.Dropdown.Item value="medium" title="Medium - Moderate complexity" />
        <Form.Dropdown.Item value="hard" title="Hard - Challenging task" />
        <Form.Dropdown.Item value="very-hard" title="Very Hard - Complex undertaking" />
      </Form.Dropdown>
      
      <Form.Dropdown id="timeAvailable" title="Time Available" defaultValue="medium">
        <Form.Dropdown.Item value="minimal" title="Minimal (< 2 hours/week)" />
        <Form.Dropdown.Item value="limited" title="Limited (2-5 hours/week)" />
        <Form.Dropdown.Item value="medium" title="Medium (5-10 hours/week)" />
        <Form.Dropdown.Item value="substantial" title="Substantial (10-20 hours/week)" />
        <Form.Dropdown.Item value="dedicated" title="Dedicated (20+ hours/week)" />
      </Form.Dropdown>
      
      <Form.Dropdown id="priority" title="Priority" defaultValue="medium">
        <Form.Dropdown.Item value="low" title="Low - Nice to have" />
        <Form.Dropdown.Item value="medium" title="Medium - Important" />
        <Form.Dropdown.Item value="high" title="High - Very important" />
        <Form.Dropdown.Item value="critical" title="Critical - Urgent" />
      </Form.Dropdown>
      
      <Form.Dropdown id="goalType" title="Goal Type" defaultValue="achievement">
        <Form.Dropdown.Item value="habit" title="Habit Formation - Regular practice" />
        <Form.Dropdown.Item value="achievement" title="Achievement - Specific outcome" />
        <Form.Dropdown.Item value="learning" title="Learning - Gaining knowledge/skill" />
        <Form.Dropdown.Item value="project" title="Project - Multi-step undertaking" />
      </Form.Dropdown>
      
      <Form.DatePicker
        id="targetDate"
        title="Target Date"
        defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
      />
      
      <Form.Description 
        title="AI Micro-Goals"
        text="After creating your goal, AI will analyze all the details to generate personalized micro-goals tailored to your specific circumstances."
      />
    </Form>
  );
}