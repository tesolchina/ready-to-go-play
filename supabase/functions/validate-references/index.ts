import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  reference: string;
  doi?: string;
  status: "no_doi" | "valid" | "invalid" | "content_mismatch";
  message: string;
  details?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { references } = await req.json();
    console.log('Starting reference validation');

    // Split references by line and filter empty lines
    const referenceList = references
      .split('\n')
      .map((ref: string) => ref.trim())
      .filter((ref: string) => ref.length > 0);

    console.log(`Processing ${referenceList.length} references`);

    const results: ValidationResult[] = [];

    for (const reference of referenceList) {
      // Extract all links (DOIs and regular URLs)
      const doiPattern = /10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/g;
      const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      
      const doiMatches = reference.match(doiPattern) || [];
      const urlMatches = reference.match(urlPattern) || [];
      
      // Create a set of all unique links (DOIs as URLs + regular URLs)
      const allLinks = new Set<string>();
      doiMatches.forEach((doi: string) => allLinks.add(`https://doi.org/${doi}`));
      urlMatches.forEach((url: string) => {
        // Only add non-DOI URLs
        if (!url.includes('doi.org')) {
          allLinks.add(url);
        }
      });

      if (allLinks.size === 0) {
        results.push({
          reference,
          status: "no_doi",
          message: "No links found",
        });
        continue;
      }

      // Validate each link found
      for (const link of allLinks) {
        const isDoi = link.includes('doi.org');
        const displayLink = isDoi ? link.replace('https://doi.org/', '') : link;
        console.log(`Validating link: ${link}`);

        // Validate link by fetching the URL
        try {
          const response = await fetch(link, {
            method: 'HEAD',
            redirect: 'follow',
          });

          if (response.ok) {
            // Link resolves successfully
            // Now fetch content to verify match
            try {
              const contentResponse = await fetch(link, {
                headers: {
                  'Accept': 'text/html,application/xhtml+xml',
                },
              });

              if (contentResponse.ok) {
                const html = await contentResponse.text();
                
                // Extract title and basic metadata from HTML
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                const pageTitle = titleMatch ? titleMatch[1].trim() : '';

                // Simple content matching - check if key words from reference appear in page
                const referenceWords = reference
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, '')
                  .split(/\s+/)
                  .filter((word: string) => word.length > 4); // Only significant words

                const pageContent = html.toLowerCase();
                const matchedWords = referenceWords.filter((word: string) => 
                  pageContent.includes(word)
                ).length;

                const matchPercentage = (matchedWords / Math.max(referenceWords.length, 1)) * 100;

                console.log(`Link ${link}: ${matchPercentage.toFixed(0)}% word match`);

                if (matchPercentage > 30) {
                  results.push({
                    reference,
                    doi: isDoi ? displayLink : undefined,
                    status: "valid",
                    message: "Link valid and content matches",
                    details: pageTitle ? `Page title: ${pageTitle}` : undefined,
                  });
                } else {
                  results.push({
                    reference,
                    doi: isDoi ? displayLink : undefined,
                    status: "content_mismatch",
                    message: "Link valid but content may not match",
                    details: `Only ${matchPercentage.toFixed(0)}% word match. ${pageTitle ? `Page title: ${pageTitle}` : ''}`,
                  });
                }
              } else {
                results.push({
                  reference,
                  doi: isDoi ? displayLink : undefined,
                  status: "valid",
                  message: "Link valid (content check unavailable)",
                });
              }
            } catch (contentError) {
              console.error(`Error fetching content for ${link}:`, contentError);
              results.push({
                reference,
                doi: isDoi ? displayLink : undefined,
                status: "valid",
                message: "Link valid (content verification failed)",
              });
            }
          } else {
            results.push({
              reference,
              doi: isDoi ? displayLink : undefined,
              status: "invalid",
              message: `Link invalid (HTTP ${response.status})`,
            });
          }
        } catch (error) {
          console.error(`Error validating link ${link}:`, error);
          results.push({
            reference,
            doi: isDoi ? displayLink : undefined,
            status: "invalid",
            message: "Link unreachable",
            details: error instanceof Error ? error.message : "Network error",
          });
        }
      }
    }

    console.log(`Validation complete. Processed ${results.length} references`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in validate-references function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
