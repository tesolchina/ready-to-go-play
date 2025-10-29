import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PracticeField {
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
}

interface PromptBuilderProps {
  practiceFields: PracticeField[];
  systemPrompt: string;
  onSubmit: (userInputs: Record<string, string>, systemPrompt: string) => Promise<string>;
  onFollowUp: (prompt: string, conversationHistory: any[], systemPrompt: string) => Promise<string>;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({ 
  practiceFields, 
  systemPrompt: initialSystemPrompt,
  onSubmit, 
  onFollowUp 
}) => {
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowingUp, setIsFollowingUp] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const emptyFields = practiceFields.filter(field => !userInputs[field.label]?.trim());
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing inputs",
        description: `Please fill in: ${emptyFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(userInputs, systemPrompt);
      setFeedback(result);
      setConversationHistory([
        { role: 'user', content: JSON.stringify(userInputs) },
        { role: 'assistant', content: result }
      ]);
      toast({
        title: "Feedback received!",
        description: "Check the response below.",
      });
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpPrompt.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a follow-up question.",
        variant: "destructive",
      });
      return;
    }

    setIsFollowingUp(true);
    try {
      const result = await onFollowUp(followUpPrompt, conversationHistory, systemPrompt);
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: followUpPrompt },
        { role: 'assistant', content: result }
      ];
      setConversationHistory(updatedHistory);
      setFeedback(result);
      setFollowUpPrompt('');
      toast({
        title: "Follow-up response received!",
      });
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsFollowingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Exercise</CardTitle>
          <CardDescription>
            Complete the fields below and get AI feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {practiceFields.map((field, index) => (
              <div key={index}>
                <Label htmlFor={`field-${index}`}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={`field-${index}`}
                    value={userInputs[field.label] || ''}
                    onChange={(e) => setUserInputs(prev => ({
                      ...prev,
                      [field.label]: e.target.value
                    }))}
                    placeholder={field.placeholder}
                    className="min-h-[100px] mt-2"
                    disabled={isSubmitting}
                  />
                ) : (
                  <Input
                    id={`field-${index}`}
                    value={userInputs[field.label] || ''}
                    onChange={(e) => setUserInputs(prev => ({
                      ...prev,
                      [field.label]: e.target.value
                    }))}
                    placeholder={field.placeholder}
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="system-prompt">System Prompt (Guides AI Feedback)</Label>
            <Textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter the system prompt for AI feedback..."
              className="min-h-[100px] mt-2 font-mono text-sm"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="whitespace-pre-wrap">{feedback}</p>
            </div>

            {/* Conversation Thread */}
            {conversationHistory.length > 2 && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {conversationHistory.slice(2).map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary/10 ml-8'
                        : 'bg-muted mr-8'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up Input */}
            <div className="flex gap-2">
              <Input
                value={followUpPrompt}
                onChange={(e) => setFollowUpPrompt(e.target.value)}
                placeholder="Ask a follow-up question..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFollowUpSubmit();
                  }
                }}
                disabled={isFollowingUp}
                className="flex-1"
              />
              <Button
                onClick={handleFollowUpSubmit}
                disabled={isFollowingUp || !followUpPrompt.trim()}
                size="icon"
              >
                {isFollowingUp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};