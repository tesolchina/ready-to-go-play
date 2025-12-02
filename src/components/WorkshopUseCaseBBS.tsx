import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MessageCircle, User, Clock, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SharedConversation {
  id: string;
  nickname: string;
  use_case_summary: string;
  chat_history: Message[];
  created_at: string;
}

interface WorkshopUseCaseBBSProps {
  refreshTrigger?: number;
}

export const WorkshopUseCaseBBS = ({ refreshTrigger }: WorkshopUseCaseBBSProps) => {
  const [conversations, setConversations] = useState<SharedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('workshop_shared_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations((data || []).map(d => ({
        ...d,
        chat_history: d.chat_history as unknown as Message[]
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('workshop-bbs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workshop_shared_conversations'
        },
        (payload) => {
          setConversations(prev => [payload.new as SharedConversation, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchConversations();
    }
  }, [refreshTrigger]);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card className="border-2 border-amber-300 dark:border-amber-700">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="border-2 border-amber-300 dark:border-amber-700">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5" />
            Shared Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p className="text-sm">No shared conversations yet.</p>
          <p className="text-xs mt-1">Be the first to share your use case!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-300 dark:border-amber-700">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg py-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          Shared Use Cases ({conversations.length})
        </CardTitle>
        <p className="text-sm text-amber-100">Click to expand and see full conversations</p>
      </CardHeader>
      <CardContent className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
        {conversations.map((conv) => (
          <Collapsible
            key={conv.id}
            open={expandedIds.has(conv.id)}
            onOpenChange={() => toggleExpanded(conv.id)}
          >
            <CollapsibleTrigger asChild>
              <button className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{conv.nickname}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(conv.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{conv.use_case_summary}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${expandedIds.has(conv.id) ? 'rotate-180' : ''}`} />
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 ml-4 pl-4 border-l-2 border-amber-300 space-y-2 pb-2">
                {conv.chat_history.map((msg, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-primary' : 'bg-indigo-500'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-3 w-3 text-primary-foreground" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 text-xs rounded p-2 ${
                      msg.role === 'user' ? 'bg-primary/10' : 'bg-indigo-50 dark:bg-indigo-900/20'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-xs dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};
