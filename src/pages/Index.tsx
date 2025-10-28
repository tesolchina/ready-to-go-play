import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to first lesson
    navigate("/lesson/1");
  }, [navigate]);

  return null;
};

export default Index;
