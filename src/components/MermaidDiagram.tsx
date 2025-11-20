import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (containerRef.current && chart) {
      const renderChart = async () => {
        try {
          const { svg } = await mermaid.render(id.current, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
          console.error('Chart content:', chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="text-destructive p-4 border border-destructive rounded">
              <p class="font-semibold">Error rendering diagram</p>
              <p class="text-sm mt-1 mb-2">${error instanceof Error ? error.message : 'The mermaid code may be invalid.'}</p>
              <details class="text-xs">
                <summary class="cursor-pointer font-medium">View raw mermaid code</summary>
                <pre class="mt-2 p-2 bg-muted rounded overflow-auto">${chart}</pre>
              </details>
            </div>`;
          }
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div ref={containerRef} className="flex justify-center items-center my-8 min-h-[200px]" />;
};
