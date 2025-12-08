import { Navigate } from "react-router-dom";

const WorkshopAIAgent = () => {
  // Redirect to the current workshop (11 Dec)
  return <Navigate to="/workshops/ai-agent-workshop-11dec" replace />;
};

export default WorkshopAIAgent;
