import { Navigate } from "react-router-dom";

const WorkshopAIAgent = () => {
  // Redirect to the current workshop (Math 19 Dec)
  return <Navigate to="/workshops/math-19dec" replace />;
};

export default WorkshopAIAgent;
