import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectionAnalyticsProps {
  lessonSlug: string;
  sectionId: string;
}

interface AnalyticsData {
  visitorCount: number;
  responseCount: number;
  topThemes: { theme: string; count: number }[];
  sentimentBreakdown: { sentiment: string; count: number }[];
}

export const SectionAnalytics = ({ lessonSlug, sectionId }: SectionAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visitorCount: 0,
    responseCount: 0,
    topThemes: [],
    sentimentBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch visitor count
        const { count: visitorCount } = await supabase
          .from("section_visits")
          .select("*", { count: "exact", head: true })
          .eq("lesson_slug", lessonSlug)
          .eq("section_id", sectionId);

        // Fetch response analytics
        const { data: responses } = await supabase
          .from("response_analytics")
          .select("sentiment, key_themes")
          .eq("lesson_slug", lessonSlug)
          .eq("section_id", sectionId);

        // Process sentiment breakdown
        const sentimentMap = new Map<string, number>();
        const themeMap = new Map<string, number>();

        responses?.forEach((response) => {
          // Count sentiment
          if (response.sentiment) {
            sentimentMap.set(
              response.sentiment,
              (sentimentMap.get(response.sentiment) || 0) + 1
            );
          }

          // Count themes
          response.key_themes?.forEach((theme: string) => {
            themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
          });
        });

        const sentimentBreakdown = Array.from(sentimentMap.entries())
          .map(([sentiment, count]) => ({ sentiment, count }))
          .sort((a, b) => b.count - a.count);

        const topThemes = Array.from(themeMap.entries())
          .map(([theme, count]) => ({ theme, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          visitorCount: visitorCount || 0,
          responseCount: responses?.length || 0,
          topThemes,
          sentimentBreakdown
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Set up real-time subscription
    const channel = supabase
      .channel('section-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_visits',
          filter: `lesson_slug=eq.${lessonSlug},section_id=eq.${sectionId}`
        },
        () => fetchAnalytics()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'response_analytics',
          filter: `lesson_slug=eq.${lessonSlug},section_id=eq.${sectionId}`
        },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonSlug, sectionId]);

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
        <p className="text-muted-foreground">Loading analytics...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
        <TrendingUp className="w-5 h-5" />
        Section Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-muted-foreground">Section Visitors</p>
            <p className="text-2xl font-bold text-foreground">{analytics.visitorCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm text-muted-foreground">Responses Analyzed</p>
            <p className="text-2xl font-bold text-foreground">{analytics.responseCount}</p>
          </div>
        </div>
      </div>

      {analytics.sentimentBreakdown.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-foreground">Sentiment Distribution</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.sentimentBreakdown.map(({ sentiment, count }) => (
              <Badge
                key={sentiment}
                variant={
                  sentiment === "positive" ? "default" :
                  sentiment === "negative" ? "destructive" : "secondary"
                }
              >
                {sentiment}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {analytics.topThemes.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Top Themes</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.topThemes.map(({ theme, count }) => (
              <Badge key={theme} variant="outline">
                {theme} ({count})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};