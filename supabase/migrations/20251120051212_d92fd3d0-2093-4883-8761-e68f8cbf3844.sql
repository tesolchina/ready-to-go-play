-- Enable realtime for section_visits table
ALTER TABLE public.section_visits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.section_visits;

-- Enable realtime for response_analytics table
ALTER TABLE public.response_analytics REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.response_analytics;