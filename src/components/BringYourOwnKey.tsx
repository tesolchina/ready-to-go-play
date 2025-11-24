import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Key, CheckCircle2, XCircle, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ApiProvider = "kimi" | "deepseek";

export const BringYourOwnKey = () => {
  const { user, isAuthenticated } = useAuth();
  const [kimiKey, setKimiKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [savedKeys, setSavedKeys] = useState<Record<ApiProvider, boolean>>({
    kimi: false,
    deepseek: false,
  });
  const [testingKey, setTestingKey] = useState<ApiProvider | null>(null);
  const [secretCode, setSecretCode] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);
  const [hasValidCode, setHasValidCode] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<ApiProvider, boolean>>({
    kimi: false,
    deepseek: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadKeys = async () => {
      if (isAuthenticated && user) {
        // Load from database for authenticated users
        try {
          const { data, error } = await supabase
            .from('user_api_keys')
            .select('provider, encrypted_key')
            .eq('user_id', user.id);

          if (!error && data) {
            data.forEach((item) => {
              const decryptedKey = atob(item.encrypted_key);
              if (item.provider === 'kimi') {
                setKimiKey(decryptedKey);
                setSavedKeys(prev => ({ ...prev, kimi: true }));
              } else if (item.provider === 'deepseek') {
                setDeepseekKey(decryptedKey);
                setSavedKeys(prev => ({ ...prev, deepseek: true }));
              }
            });
          }
        } catch (error) {
          console.error('Error loading API keys from database:', error);
        }
      } else {
        // Load from localStorage for guest users
        const storedKimiKey = localStorage.getItem("user_kimi_api_key");
        const storedDeepseekKey = localStorage.getItem("user_deepseek_api_key");
        
        if (storedKimiKey) {
          setKimiKey(storedKimiKey);
          setSavedKeys(prev => ({ ...prev, kimi: true }));
        }
        if (storedDeepseekKey) {
          setDeepseekKey(storedDeepseekKey);
          setSavedKeys(prev => ({ ...prev, deepseek: true }));
        }
      }

      // Load secret code session
      const storedSecretCodeSession = localStorage.getItem("platform_secret_session");
      if (storedSecretCodeSession) {
        try {
          const session = JSON.parse(storedSecretCodeSession);
          const sessionAge = Date.now() - session.timestamp;
          if (sessionAge < 24 * 60 * 60 * 1000) {
            setHasValidCode(true);
          } else {
            localStorage.removeItem("platform_secret_session");
          }
        } catch (e) {
          console.error("Invalid session data:", e);
          localStorage.removeItem("platform_secret_session");
        }
      }
    };

    loadKeys();
  }, [user, isAuthenticated]);

  const testApiKey = async (provider: ApiProvider, key: string) => {
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return false;
    }

    setTestingKey(provider);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-api-key', {
        body: { provider, apiKey: key.trim() }
      });

      if (error) {
        console.error(`Error testing ${provider} API key:`, error);
        toast({
          title: "Connection Failed",
          description: `Could not connect to validation service. Please try again.`,
          variant: "destructive",
        });
        return false;
      }

      if (!data.valid) {
        console.error(`${provider} API test failed:`, data.error, data.details);
        
        toast({
          title: "Invalid API Key",
          description: `The ${provider === "kimi" ? "Kimi" : "DeepSeek"} API key appears to be invalid. Please check and try again.`,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Connection Successful",
        description: `${provider === "kimi" ? "Kimi" : "DeepSeek"} API key is valid and working!`,
      });
      return true;
      
    } catch (error) {
      console.error(`Error testing ${provider} API key:`, error);
      toast({
        title: "Connection Failed",
        description: `Could not connect to validation service. Please try again.`,
        variant: "destructive",
      });
      return false;
    } finally {
      setTestingKey(null);
    }
  };

  const handleSaveKey = async (provider: ApiProvider, key: string) => {
    const isValid = await testApiKey(provider, key);
    
    if (!isValid) {
      return;
    }

    if (isAuthenticated && user) {
      // Save to database for authenticated users
      try {
        const encryptedKey = btoa(key.trim());
        const { error } = await supabase
          .from('user_api_keys')
          .upsert({
            user_id: user.id,
            provider,
            encrypted_key: encryptedKey,
          }, {
            onConflict: 'user_id,provider'
          });

        if (error) throw error;

        setSavedKeys(prev => ({ ...prev, [provider]: true }));
        window.dispatchEvent(new Event('ai-service-updated'));
        
        toast({
          title: "API Key Saved",
          description: `Your ${provider === "kimi" ? "Kimi" : "DeepSeek"} API key has been saved securely to your account`,
        });
      } catch (error) {
        console.error('Error saving API key to database:', error);
        toast({
          title: "Error",
          description: "Failed to save API key. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Save to localStorage for guest users
      const storageKey = `user_${provider}_api_key`;
      localStorage.setItem(storageKey, key.trim());
      setSavedKeys(prev => ({ ...prev, [provider]: true }));
      window.dispatchEvent(new Event('ai-service-updated'));
      
      toast({
        title: "API Key Saved",
        description: `Your ${provider === "kimi" ? "Kimi" : "DeepSeek"} API key has been saved locally. Sign in to save it permanently.`,
      });
    }
  };

  const handleRemoveKey = async (provider: ApiProvider) => {
    if (isAuthenticated && user) {
      // Remove from database for authenticated users
      try {
        const { error } = await supabase
          .from('user_api_keys')
          .delete()
          .eq('user_id', user.id)
          .eq('provider', provider);

        if (error) throw error;

        if (provider === "kimi") {
          setKimiKey("");
        } else {
          setDeepseekKey("");
        }
        
        setSavedKeys(prev => ({ ...prev, [provider]: false }));
        window.dispatchEvent(new Event('ai-service-updated'));
        
        toast({
          title: "API Key Removed",
          description: `Your ${provider === "kimi" ? "Kimi" : "DeepSeek"} API key has been removed from your account`,
        });
      } catch (error) {
        console.error('Error removing API key from database:', error);
        toast({
          title: "Error",
          description: "Failed to remove API key. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Remove from localStorage for guest users
      const storageKey = `user_${provider}_api_key`;
      localStorage.removeItem(storageKey);
      
      if (provider === "kimi") {
        setKimiKey("");
      } else {
        setDeepseekKey("");
      }
      
      setSavedKeys(prev => ({ ...prev, [provider]: false }));
      window.dispatchEvent(new Event('ai-service-updated'));
      
      toast({
        title: "API Key Removed",
        description: `Your ${provider === "kimi" ? "Kimi" : "DeepSeek"} API key has been removed`,
      });
    }
  };

  const validateSecretCode = async () => {
    if (!secretCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a secret code",
        variant: "destructive",
      });
      return;
    }

    setValidatingCode(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-secret-code', {
        body: { secretCode: secretCode.trim() }
      });

      if (error) throw error;

      if (data.valid) {
        // Store session token
        const session = {
          token: data.sessionToken,
          timestamp: Date.now()
        };
        localStorage.setItem("platform_secret_session", JSON.stringify(session));
        setHasValidCode(true);
        setSecretCode("");
        
        // Notify context of change
        window.dispatchEvent(new Event('ai-service-updated'));
        
        toast({
          title: "Success!",
          description: data.message || "You can now use platform API keys for all features.",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: data.message || "The secret code you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating secret code:', error);
      toast({
        title: "Validation Failed",
        description: "Could not validate secret code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setValidatingCode(false);
    }
  };

  const handleRevokeAccess = () => {
    localStorage.removeItem("platform_secret_session");
    setHasValidCode(false);
    
    // Notify context of change
    window.dispatchEvent(new Event('ai-service-updated'));
    
    toast({
      title: "Access Revoked",
      description: "Platform API key access has been removed.",
    });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          <CardTitle>Bring Your Own Key (BYOK)</CardTitle>
        </div>
        <CardDescription>
          Provide an API key from either Kimi or DeepSeek (you only need one). Your keys are stored locally in your browser and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Note:</strong> You only need to provide ONE API key from either Kimi or DeepSeek. 
            Your key will be tested before saving to ensure it works correctly. Keys are stored in your browser's local storage and only used for API requests you initiate.
          </AlertDescription>
        </Alert>

        {/* Secret Code Section */}
        <div className="space-y-3 p-4 border-2 border-primary/30 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <Label htmlFor="secret-code" className="text-base font-semibold">
              Platform Access Code
            </Label>
            {hasValidCode && (
              <Badge variant="default" className="ml-auto">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Have a secret access code? Enter it here to use the platform's API keys instead of providing your own.
          </p>
          
          {!hasValidCode ? (
            <div className="space-y-3">
              <Input
                id="secret-code"
                type="password"
                placeholder="Enter your secret code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    validateSecretCode();
                  }
                }}
              />
              <Button
                onClick={validateSecretCode}
                disabled={validatingCode || !secretCode.trim()}
                className="w-full"
              >
                {validatingCode ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Validate Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  You have platform access! All AI features will use the platform's API keys automatically.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleRevokeAccess}
                variant="outline"
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Revoke Access
              </Button>
            </div>
          )}
        </div>

        {!hasValidCode && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or provide your own API key
                </span>
              </div>
            </div>
          </>
        )}

        {/* Kimi API Key */}
        {!hasValidCode && (
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="kimi-key" className="text-base font-semibold">
                Kimi API Key
              </Label>
              {savedKeys.kimi ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Set
                </Badge>
              )}
            </div>
            <a
              href="https://platform.moonshot.cn/console/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Get Key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Get your API key from the Moonshot AI Platform (Kimi). You'll need to create an account and navigate to the API keys section.
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="kimi-key"
                type={showKeys.kimi ? "text" : "password"}
                value={kimiKey}
                onChange={(e) => setKimiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              {kimiKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKeys(prev => ({ ...prev, kimi: !prev.kimi }))}
                >
                  {showKeys.kimi ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>
            {savedKeys.kimi ? (
              <Button
                variant="destructive"
                onClick={() => handleRemoveKey("kimi")}
              >
                Remove
              </Button>
            ) : (
              <Button
                onClick={() => handleSaveKey("kimi", kimiKey)}
                disabled={!kimiKey.trim() || testingKey === "kimi"}
              >
                {testingKey === "kimi" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test & Save"
                )}
              </Button>
            )}
          </div>
        </div>
        )}

        {/* DeepSeek API Key */}
        {!hasValidCode && (
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="deepseek-key" className="text-base font-semibold">
                DeepSeek API Key
              </Label>
              {savedKeys.deepseek ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Set
                </Badge>
              )}
            </div>
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Get Key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Get your API key from the DeepSeek Platform. Sign up for an account and generate an API key from your dashboard.
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="deepseek-key"
                type={showKeys.deepseek ? "text" : "password"}
                value={deepseekKey}
                onChange={(e) => setDeepseekKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              {deepseekKey && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKeys(prev => ({ ...prev, deepseek: !prev.deepseek }))}
                >
                  {showKeys.deepseek ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}
            </div>
            {savedKeys.deepseek ? (
              <Button
                variant="destructive"
                onClick={() => handleRemoveKey("deepseek")}
              >
                Remove
              </Button>
            ) : (
              <Button
                onClick={() => handleSaveKey("deepseek", deepseekKey)}
                disabled={!deepseekKey.trim() || testingKey === "deepseek"}
              >
                {testingKey === "deepseek" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test & Save"
                )}
              </Button>
            )}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};
