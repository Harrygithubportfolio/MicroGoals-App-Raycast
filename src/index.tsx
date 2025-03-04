// src/index.tsx
import { List, ActionPanel, Action, getPreferenceValues, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import axios from "axios";

interface MicroGoal {
  _id: string;
  title: string;
  description: string;
  isDone: boolean;
  estimatedTime?: string;
  difficulty?: string;
  order?: number;
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  createdAt: string;
  microGoals: MicroGoal[];
  metadata?: {
    difficulty?: string;
    timeAvailable?: string;
    priority?: string;
    goalType?: string;
  };
}

interface Preferences {
  apiUrl: string;
  userId: string;
}

export default function Command() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const preferences = getPreferenceValues<Preferences>();
  
  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await axios.get(`${preferences.apiUrl}/goals?userId=000000000000000000000001`, {
          headers: {
            'x-api-key': preferences.apiKey
          }
        });
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGoals();
  }, []);
  
  const calculateProgress = (goal: Goal) => {
    if (!goal.microGoals || goal.microGoals.length === 0) return 0;
    const completed = goal.microGoals.filter(mg => mg.isDone).length;
    return Math.round((completed / goal.microGoals.length) * 100);
  };
  
  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search goals...">
      {goals.length === 0 && !isLoading ? (
        <List.EmptyView
          title="No goals found"
          description="Create your first goal using the 'Add Goal' command"
          icon={Icon.Plus}
        />
      ) : (
        goals.map((goal) => (
          <List.Item
            key={goal._id}
            title={goal.title}
            subtitle={goal.description}
            accessories={[
              { 
                text: `${calculateProgress(goal)}%`, 
                tooltip: "Completion percentage" 
              },
              { 
                text: goal.metadata?.priority || "Medium", 
                tooltip: "Priority" 
              },
              { 
                text: `${goal.microGoals.length} micro-goals`, 
                tooltip: "Number of micro-goals" 
              }
            ]}
            actions={
              <ActionPanel>
                <Action.Push
                  title="View Micro-Goals"
                  target={<MicroGoalsList goal={goal} />}
                  icon={Icon.List}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

function MicroGoalsList({ goal }: { goal: Goal }) {
  const preferences = getPreferenceValues<Preferences>();
  const [microGoals, setMicroGoals] = useState<MicroGoal[]>(goal.microGoals);
  
  // Sort microgoals by order property if available, otherwise keep original order
  const sortedMicroGoals = [...microGoals].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  const toggleMicroGoal = async (microGoalId: string, isDone: boolean) => {
    try {
      await axios.patch(`${preferences.apiUrl}/goals/microgoal/${goal._id}/${microGoalId}`, {
        isDone: !isDone
      });
      
      // Update state
      setMicroGoals(prev => 
        prev.map(mg => 
          mg._id === microGoalId ? { ...mg, isDone: !mg.isDone } : mg
        )
      );
    } catch (error) {
      console.error("Error updating micro-goal:", error);
    }
  };
  
  const calculateProgress = () => {
    if (!microGoals || microGoals.length === 0) return 0;
    const completed = microGoals.filter(mg => mg.isDone).length;
    return Math.round((completed / microGoals.length) * 100);
  };
  
  const getProgressColor = (progress: number) => {
    if (progress < 25) return Color.Red;
    if (progress < 50) return Color.Orange;
    if (progress < 75) return Color.Yellow;
    return Color.Green;
  };
  
  return (
    <List navigationTitle={`${goal.title} (${calculateProgress()}% complete)`}>
      {/* Goal details item */}
      <List.Section title="Goal Details">
        <List.Item
          title={goal.title}
          subtitle={goal.description}
          icon={Icon.Document}
          accessories={[
            { 
              text: new Date(goal.targetDate).toLocaleDateString(), 
              tooltip: "Target Date" 
            },
            { 
              text: goal.category || "General", 
              tooltip: "Category" 
            },
            {
              tag: {
                value: `${calculateProgress()}%`,
                color: getProgressColor(calculateProgress())
              },
              tooltip: "Completion Progress"
            }
          ]}
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Goal" text={goal.title} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Description" text={goal.description || "No description"} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Category" text={goal.category || "General"} />
                  <List.Item.Detail.Metadata.Label title="Target Date" text={new Date(goal.targetDate).toLocaleDateString()} />
                  <List.Item.Detail.Metadata.Label title="Created" text={new Date(goal.createdAt).toLocaleDateString()} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Difficulty" text={goal.metadata?.difficulty || "Medium"} />
                  <List.Item.Detail.Metadata.Label title="Time Available" text={goal.metadata?.timeAvailable || "Medium"} />
                  <List.Item.Detail.Metadata.Label title="Priority" text={goal.metadata?.priority || "Medium"} />
                  <List.Item.Detail.Metadata.Label title="Goal Type" text={goal.metadata?.goalType || "Achievement"} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Progress" text={`${calculateProgress()}% complete`} />
                  <List.Item.Detail.Metadata.Label title="Micro-Goals" text={`${microGoals.length} total`} />
                  <List.Item.Detail.Metadata.Label title="Completed" text={`${microGoals.filter(mg => mg.isDone).length} micro-goals`} />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      </List.Section>
      
      {/* Micro-goals section */}
<List.Section 
  title="Micro-Goals" 
  subtitle={`${microGoals.filter(mg => mg.isDone).length} of ${microGoals.length} completed`}
>
  {sortedMicroGoals.map((microGoal) => (
    <List.Item
      key={microGoal._id}
      title={microGoal.title}
      subtitle={microGoal.description}
      icon={microGoal.isDone ? Icon.CheckCircle : Icon.Circle}
      accessories={[
        microGoal.estimatedTime ? { 
          text: microGoal.estimatedTime, 
          tooltip: "Estimated time" 
        } : null,
        microGoal.difficulty ? { 
          text: microGoal.difficulty, 
          tooltip: "Difficulty" 
        } : null,
        { 
          tag: { 
            value: microGoal.isDone ? "Completed" : "In Progress",
            color: microGoal.isDone ? Color.Green : Color.Blue
          }
        }
      ].filter(accessory => accessory !== null)}
            actions={
              <ActionPanel>
                <Action
                  title={microGoal.isDone ? "Mark as Incomplete" : "Mark as Complete"}
                  onAction={() => toggleMicroGoal(microGoal._id, microGoal.isDone)}
                  icon={microGoal.isDone ? Icon.XMarkCircle : Icon.CheckCircle}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}