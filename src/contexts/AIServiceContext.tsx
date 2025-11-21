import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AIServiceContextType {
  isActivated: boolean;
  hasPlatformAccess: boolean;
  hasUserKey: boolean;
  checkActivation: () => void;
}

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

export const AIServiceProvider = ({ children }: { children: ReactNode }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [hasPlatformAccess, setHasPlatformAccess] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);

  const checkActivation = () => {
    // Check for platform access code
    const storedSession = localStorage.getItem("platform_secret_session");
    let platformValid = false;
    
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const sessionAge = Date.now() - session.timestamp;
        platformValid = sessionAge < 24 * 60 * 60 * 1000;
      } catch (e) {
        console.error("Invalid session data:", e);
        localStorage.removeItem("platform_secret_session");
      }
    }

    // Check for user API keys
    const kimiKey = localStorage.getItem("user_kimi_api_key");
    const deepseekKey = localStorage.getItem("user_deepseek_api_key");
    const userKeyValid = !!(kimiKey || deepseekKey);

    setHasPlatformAccess(platformValid);
    setHasUserKey(userKeyValid);
    setIsActivated(platformValid || userKeyValid);
  };

  useEffect(() => {
    checkActivation();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkActivation();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab changes
    window.addEventListener('ai-service-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ai-service-updated', handleStorageChange);
    };
  }, []);

  return (
    <AIServiceContext.Provider value={{ isActivated, hasPlatformAccess, hasUserKey, checkActivation }}>
      {children}
    </AIServiceContext.Provider>
  );
};

export const useAIService = () => {
  const context = useContext(AIServiceContext);
  if (context === undefined) {
    throw new Error('useAIService must be used within an AIServiceProvider');
  }
  return context;
};
