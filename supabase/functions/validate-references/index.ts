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
      // Extract DOI using regex patterns
      const doiPattern = /10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/g;
      const doiMatch = reference.match(doiPattern);

      if (!doiMatch || doiMatch.length === 0) {
        results.push({
          reference,
          status: "no_doi",
          message: "No DOI found",
        });
        continue;
      }

      const doi = doiMatch[0];
      console.log(`Found DOI: ${doi}`);

      // Validate DOI by fetching the URL
      try {
        const doiUrl = `https://doi.org/${doi}`;
        const response = await fetch(doiUrl, {
          method: 'HEAD',
          redirect: 'follow',
        });

        if (response.ok) {
          // DOI resolves successfully
          // Now fetch content to verify match
          try {
            const contentResponse = await fetch(doiUrl, {
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

              console.log(`DOI ${doi}: ${matchPercentage.toFixed(0)}% word match`);

              if (matchPercentage > 30) {
                results.push({
                  reference,
                  doi,
                  status: "valid",
                  message: "DOI valid and content matches",
                  details: pageTitle ? `Page title: ${pageTitle}` : undefined,
                });
              } else {
                results.push({
                  reference,
                  doi,
                  status: "content_mismatch",
                  message: "DOI valid but content may not match",
                  details: `Only ${matchPercentage.toFixed(0)}% word match. ${pageTitle ? `Page title: ${pageTitle}` : ''}`,
                });
              }
            } else {
              results.push({
                reference,
                doi,
                status: "valid",
                message: "DOI valid (content check unavailable)",
              });
            }
          } catch (contentError) {
            console.error(`Error fetching content for ${doi}:`, contentError);
            results.push({
              reference,
              doi,
              status: "valid",
              message: "DOI valid (content verification failed)",
            });
          }
        } else {
          results.push({
            reference,
            doi,
            status: "invalid",
            message: `DOI link invalid (HTTP ${response.status})`,
          });
        }
      } catch (error) {
        console.error(`Error validating DOI ${doi}:`, error);
        results.push({
          reference,
          doi,
          status: "invalid",
          message: "DOI link unreachable",
          details: error instanceof Error ? error.message : "Network error",
        });
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
