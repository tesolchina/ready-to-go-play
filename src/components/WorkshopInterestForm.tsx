import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, CheckCircle, Sparkles, BookOpen, BarChart3, Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const WorkshopInterestForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [interests, setInterests] = useState({
    learningApps: false,
    studentEngagement: false,
    learningAnalytics: false,
    researchLiterature: false,
    draftPapers: false,
  });
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your full name and institutional email.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('workshop_interest_submissions')
        .insert([{
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          institution: institution.trim() || null,
          interests: interests,
          additional_notes: additionalNotes.trim() || null
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your interest has been registered. We will be in touch soon.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us via WeChat.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-2 border-green-300 dark:border-green-700">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Interest Registered!</h3>
          <p className="text-muted-foreground">
            Thank you for your interest. We will contact you soon with more details about the platform.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/50">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Express Your Interest
        </CardTitle>
        <p className="text-sm text-primary-foreground/90">
          Join our platform for AI-powered teaching and research
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Platform Features */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3">Platform Offerings:</h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Develop custom learning apps for your students</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Engage students with interactive AI-powered content</span>
            </div>
            <div className="flex items-start gap-2">
              <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Access chat history and learning analytics</span>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Upload research literature and draft papers (LLM-powered)</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Institutional Email *</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@university.edu"
                maxLength={150}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Institution / Affiliation</label>
            <Input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g., The University of Hong Kong"
              maxLength={150}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Areas of Interest</label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={interests.learningApps}
                  onCheckedChange={(checked) => setInterests({...interests, learningApps: !!checked})}
                />
                <span className="text-sm">Developing learning apps</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={interests.studentEngagement}
                  onCheckedChange={(checked) => setInterests({...interests, studentEngagement: !!checked})}
                />
                <span className="text-sm">Student engagement tools</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={interests.learningAnalytics}
                  onCheckedChange={(checked) => setInterests({...interests, learningAnalytics: !!checked})}
                />
                <span className="text-sm">Learning analytics & data</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={interests.researchLiterature}
                  onCheckedChange={(checked) => setInterests({...interests, researchLiterature: !!checked})}
                />
                <span className="text-sm">Research literature management</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={interests.draftPapers}
                  onCheckedChange={(checked) => setInterests({...interests, draftPapers: !!checked})}
                />
                <span className="text-sm">AI-assisted paper drafting</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes (Optional)</label>
            <Textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific needs or questions..."
              className="min-h-[80px]"
              maxLength={500}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Interest
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
