import { List, ActionPanel, Action, showToast, Toast, getPreferenceValues, Icon } from "@raycast/api";
import { useState, useEffect } from "react";
import axios from "axios";

interface Goal {
  _id: string;
  title: string;
  microGoals: MicroGoal[];
}

interface MicroGoal {
  _id: string;
  title: string;
  description: string;
  isDone: boolean;
}

interface Preferences {
  apiUrl: string;
  userId: string;
}

export default function CheckMicroGoal() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const preferences = getPreferenceValues<Preferences>();
  
  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await axios.get(`${preferences.apiUrl}/goals?userId=${preferences.userId}`);
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to Load Goals",
          message: "Check your API connection and user ID"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGoals();
  }, []);
  
  const selectedGoal = goals.find(goal => goal._id === selectedGoalId);
  
  const toggleMicroGoal = async (goalId: string, microGoalId: string, isDone: boolean) => {
    try {
      await axios.patch(`${preferences.apiUrl}/goals/microgoal/${goalId}/${microGoalId}`, {
        isDone: !isDone
      });
      
      // Update state
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal._id === goalId) {
            return {
              ...goal,
              microGoals: goal.microGoals.map(mg => 
                mg._id === microGoalId ? { ...mg, isDone: !mg.isDone } : mg
              )
            };
          }
          return goal;
        })
      );
      
      await showToast({
        style: Toast.Style.Success,
        title: isDone ? "Marked as Incomplete" : "Marked as Complete",
        message: "Micro-goal status updated"
      });
    } catch (error) {
      console.error("Error updating micro-goal:", error);
      
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Update",
        message: "Please try again"
      });
    }
  };
  
  if (selectedGoalId && selectedGoal) {
    // Show micro-goals for selected goal
    return (
      <List
        isLoading={isLoading}
        searchBarPlaceholder="Search micro-goals..."
        navigationTitle={selectedGoal.title}
        actions={
          <ActionPanel>
            <Action 
              title="Go Back to Goals" 
              onAction={() => setSelectedGoalId(null)} 
              icon={Icon.ArrowLeft}
            />
          </ActionPanel>
        }
      >
        {selectedGoal.microGoals.map((microGoal) => (
          <List.Item
            key={microGoal._id}
            title={microGoal.title}
            subtitle={microGoal.description}
            icon={microGoal.isDone ? Icon.CheckCircle : Icon.Circle}
            accessories={[{ text: microGoal.isDone ? "Completed" : "In Progress" }]}
            actions={
              <ActionPanel>
                <Action
                  title={microGoal.isDone ? "Mark as Incomplete" : "Mark as Complete"}
                  onAction={() => toggleMicroGoal(selectedGoal._id, microGoal._id, microGoal.isDone)}
                  icon={microGoal.isDone ? Icon.XMarkCircle : Icon.CheckCircle}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    );
  }
  
  // Show goals list
  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search goals...">
      {goals.length === 0 && !isLoading ? (
        <List.EmptyView
          title="No goals found"
          description="Create your first goal using the 'Add Goal' command"
          icon={Icon.Plus}
        />
      ) : (
        goals.map((goal) => {
          const pendingMicroGoals = goal.microGoals.filter(mg => !mg.isDone).length;
          return (
            <List.Item
              key={goal._id}
              title={goal.title}
              accessories={[
                { 
                  text: `${pendingMicroGoals} remaining`, 
                  tooltip: `${pendingMicroGoals} micro-goals left to complete` 
                }
              ]}
              actions={
                <ActionPanel>
                  <Action 
                    title="View Micro-Goals" 
                    onAction={() => setSelectedGoalId(goal._id)} 
                    icon={Icon.List}
                  />
                </ActionPanel>
              }
            />
          );
        })
      )}
    </List>
  );
}