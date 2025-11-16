import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  reference: string;
  doi?: string;
  status: "no_links" | "valid" | "invalid" | "content_mismatch" | "searching" | "found_via_search" | "not_found";
  message: string;
  details?: string;
}

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  authors?: Array<{ name: string }>;
  year?: number;
  externalIds?: {
    DOI?: string;
    ArXiv?: string;
  };
  url?: string;
  doi?: string; // For PubMed results
}

// Helper to calculate string similarity (Levenshtein distance based)
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Parse reference to extract title, authors, year
function parseReference(reference: string): { title: string; authors: string[]; year?: number } {
  // Extract year (4 digits)
  const yearMatch = reference.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

  // Remove URLs, DOIs, and year from reference to get title and authors
  let cleanRef = reference
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/g, '')
    .replace(/\b(19|20)\d{2}\b/g, '')
    .trim();

  // Try to extract title (usually after first period or in quotes)
  const titleMatch = cleanRef.match(/[."""]([^."""]+)[."""]/);
  const title = titleMatch ? titleMatch[1].trim() : cleanRef.split('.')[1]?.trim() || cleanRef;

  // Extract potential author names (words before first period or comma)
  const authorsPart = cleanRef.split(/[.]/)[0] || '';
  const authors = authorsPart.split(/[,&]/).map(a => a.trim()).filter(a => a.length > 2);

  return { title, authors, year };
}

// Search Semantic Scholar API
let lastSemanticScholarCall = 0;
async function searchSemanticScholar(query: string, apiKey: string): Promise<SemanticScholarPaper[]> {
  const now = Date.now();
  const timeSinceLastCall = now - lastSemanticScholarCall;
  if (timeSinceLastCall < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastCall));
  }
  lastSemanticScholarCall = Date.now();

  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&fields=title,authors,year,externalIds,url&limit=5`;

  const response = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Semantic Scholar API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Search PubMed API
async function searchPubMed(query: string): Promise<any[]> {
  try {
    // Search for articles
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=5`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`PubMed search error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult?.idlist || [];

    if (ids.length === 0) return [];

    // Fetch details for found articles
    const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const detailsResponse = await fetch(detailsUrl);
    
    if (!detailsResponse.ok) {
      throw new Error(`PubMed details error: ${detailsResponse.status}`);
    }

    const detailsData = await detailsResponse.json();
    const results = [];

    for (const id of ids) {
      const article = detailsData.result?.[id];
      if (article) {
        results.push({
          title: article.title || '',
          authors: article.authors?.map((a: any) => ({ name: a.name })) || [],
          year: parseInt(article.pubdate?.substring(0, 4)) || undefined,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          doi: article.elocationid?.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/)?.[0]
        });
      }
    }

    return results;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

// Perform web search to verify article existence
async function verifyViaWebSearch(reference: string): Promise<{ found: boolean; source?: string; url?: string }> {
  try {
    const parsed = parseReference(reference);
    const searchQuery = `"${parsed.title}" ${parsed.authors[0] || ''} ${parsed.year || ''}`;
    
    // Simple web search to verify existence
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const html = await response.text();
      // Check if we find academic sources in results
      const hasScholarLink = html.includes('scholar.google.com') || 
                            html.includes('doi.org') || 
                            html.includes('pubmed') ||
                            html.includes('jstor.org') ||
                            html.includes('wiley.com') ||
                            html.includes('springer.com') ||
                            html.includes('sciencedirect.com');
      
      if (hasScholarLink) {
        return { found: true, source: 'Web search', url: searchUrl };
      }
    }
    
    return { found: false };
  } catch (error) {
    console.error('Web search verification error:', error);
    return { found: false };
  }
}

// Match reference with search results
function findBestMatch(reference: string, papers: SemanticScholarPaper[]): SemanticScholarPaper | null {
  const parsed = parseReference(reference);
  let bestMatch: SemanticScholarPaper | null = null;
  let bestScore = 0;

  for (const paper of papers) {
    let score = 0;

    // Title similarity (most important)
    const titleSim = similarity(parsed.title, paper.title || '');
    score += titleSim * 0.7;

    // Year match
    if (parsed.year && paper.year && Math.abs(parsed.year - paper.year) <= 1) {
      score += 0.2;
    }

    // Author match
    if (parsed.authors.length > 0 && paper.authors) {
      const paperAuthors = paper.authors.map(a => a.name.toLowerCase());
      const matchingAuthors = parsed.authors.filter(a => 
        paperAuthors.some(pa => pa.includes(a.toLowerCase()) || a.toLowerCase().includes(pa))
      );
      score += (matchingAuthors.length / parsed.authors.length) * 0.1;
    }

    if (score > bestScore && titleSim > 0.6) {
      bestScore = score;
      bestMatch = paper;
    }
  }

  return bestScore > 0.6 ? bestMatch : null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { references } = await req.json();
    console.log('Starting reference validation');

    const SEMANTIC_SCHOLAR_API_KEY = Deno.env.get('SEMANTIC_SCHOLAR_API_KEY');

    // Split references by line and filter empty lines
    const referenceList = references
      .split('\n')
      .map((ref: string) => ref.trim())
      .filter((ref: string) => ref.length > 0);

    console.log(`Processing ${referenceList.length} references`);

    // Create a text encoder for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let processedCount = 0;

        for (const reference of referenceList) {
          processedCount++;
          
          // Send progress update
          const progressMsg = `data: ${JSON.stringify({
            type: 'progress',
            current: processedCount,
            total: referenceList.length,
            reference: reference.substring(0, 100) + (reference.length > 100 ? '...' : '')
          })}\n\n`;
          controller.enqueue(encoder.encode(progressMsg));

          // Extract all links (DOIs and regular URLs)
          const doiPattern = /10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/g;
          const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
          
          const doiMatches = reference.match(doiPattern) || [];
          const urlMatches = reference.match(urlPattern) || [];
          
          // Helper to clean trailing punctuation from URLs
          const cleanUrl = (url: string): string => {
            return url.replace(/[.,;:!?)\]]+$/, '');
          };
          
          // Create a set of all unique links (DOIs as URLs + regular URLs)
          const allLinks = new Set<string>();
          doiMatches.forEach((doi: string) => allLinks.add(`https://doi.org/${doi}`));
          urlMatches.forEach((url: string) => {
            // Only add non-DOI URLs, and clean trailing punctuation
            if (!url.includes('doi.org')) {
              allLinks.add(cleanUrl(url));
            }
          });

          if (allLinks.size === 0) {
            // No links found - search Semantic Scholar
            if (!SEMANTIC_SCHOLAR_API_KEY) {
              const result: ValidationResult = {
                reference,
                status: "no_links",
                message: "No links found (Semantic Scholar search unavailable)",
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              continue;
            }

            // Send searching status
            const searchingResult: ValidationResult = {
              reference,
              status: "searching",
              message: "Searching academic databases...",
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result: searchingResult })}\n\n`));

            try {
              const parsed = parseReference(reference);
              console.log(`Searching Semantic Scholar for: "${parsed.title}"`);
              
              let match = null;
              let source = 'Semantic Scholar';
              
              // Try Semantic Scholar first
              try {
                const papers = await searchSemanticScholar(parsed.title, SEMANTIC_SCHOLAR_API_KEY);
                match = findBestMatch(reference, papers);
              } catch (ssError) {
                console.log('Semantic Scholar search failed, trying PubMed...');
              }

              // If no match in Semantic Scholar, try PubMed
              if (!match) {
                console.log(`Searching PubMed for: "${parsed.title}"`);
                const pubmedResults = await searchPubMed(parsed.title);
                if (pubmedResults.length > 0) {
                  match = findBestMatch(reference, pubmedResults);
                  source = 'PubMed';
                }
              }

              // If still no match, try web search verification
              if (!match) {
                console.log('Trying web search verification...');
                const webResult = await verifyViaWebSearch(reference);
                if (webResult.found) {
                  const result: ValidationResult = {
                    reference,
                    status: "found_via_search",
                    message: "Verified via web search",
                    details: `Found in ${webResult.source}`,
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
                  continue;
                }
              }

              if (match && (match.externalIds?.DOI || match.doi)) {
                // Found a match with DOI - validate it
                const doi = match.externalIds?.DOI || match.doi;
                const doiUrl = `https://doi.org/${doi}`;
                console.log(`Found match via ${source}: ${doiUrl}`);

                try {
                  const response = await fetch(doiUrl, { method: 'HEAD', redirect: 'follow' });
                  
                  const result: ValidationResult = {
                    reference,
                    doi: doi,
                    status: response.ok ? "found_via_search" : "invalid",
                    message: response.ok 
                      ? `Found and validated via ${source}` 
                      : `Found via ${source} but DOI invalid (HTTP ${response.status})`,
                    details: `Match: "${match.title}" (${match.year || 'N/A'})`,
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
                } catch (error) {
                  const result: ValidationResult = {
                    reference,
                    doi: doi,
                    status: "invalid",
                    message: `Found via ${source} but DOI unreachable`,
                    details: `Match: "${match.title}" - ${error instanceof Error ? error.message : 'Network error'}`,
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
                }
              } else if (match && match.url) {
                // Found a match with URL but no DOI
                const result: ValidationResult = {
                  reference,
                  status: "found_via_search",
                  message: `Found via ${source} (no DOI available)`,
                  details: `Match: "${match.title}" (${match.year || 'N/A'}) - ${match.url}`,
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              } else {
                // No match found anywhere
                const result: ValidationResult = {
                  reference,
                  status: "not_found",
                  message: "No matching papers found in academic databases or web search",
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              }
            } catch (error) {
              console.error(`Error during search:`, error);
              const result: ValidationResult = {
                reference,
                status: "not_found",
                message: "Search failed",
                details: error instanceof Error ? error.message : "Unknown error",
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
            }
            continue;
          }

          // Validate each link found
          for (const link of allLinks) {
            const isDoi = link.includes('doi.org');
            const displayLink = isDoi ? link.replace('https://doi.org/', '') : link;
            console.log(`Validating link: ${link}`);

            // For DOIs, use Crossref API
            if (isDoi) {
              try {
                const crossrefUrl = `https://api.crossref.org/works/${encodeURIComponent(displayLink)}`;
                const response = await fetch(crossrefUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ReferenceValidator/1.0)',
                  },
                  signal: AbortSignal.timeout(10000),
                });

                if (response.ok) {
                  const data = await response.json();
                  const work = data.message;
                  const title = work?.title?.[0] || 'Unknown';
                  const authors = work?.author?.map((a: any) => `${a.given || ''} ${a.family || ''}`).join(', ') || 'Unknown';
                  
                  const result: ValidationResult = {
                    reference,
                    doi: displayLink,
                    status: "valid",
                    message: "DOI validated via Crossref",
                    details: `Title: ${title}\nAuthors: ${authors}`,
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
                } else {
                  const result: ValidationResult = {
                    reference,
                    doi: displayLink,
                    status: "invalid",
                    message: "DOI not found in Crossref",
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
                }
              } catch (error) {
                const result: ValidationResult = {
                  reference,
                  doi: displayLink,
                  status: "invalid",
                  message: "Crossref API error",
                  details: error instanceof Error ? error.message : "Network error",
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              }
              continue;
            }

            // For non-DOI links, simple fetch
            try {
              const response = await fetch(link, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                signal: AbortSignal.timeout(15000),
              });

              if (response.ok) {
                const result: ValidationResult = {
                  reference,
                  status: "valid",
                  message: "Link accessible",
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              } else {
                const result: ValidationResult = {
                  reference,
                  status: "invalid",
                  message: `Link returned HTTP ${response.status}`,
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
              }
            } catch (error) {
              const result: ValidationResult = {
                reference,
                status: "invalid",
                message: "Link unreachable",
                details: error instanceof Error ? error.message : "Network error",
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', result })}\n\n`));
            }
          }
        }

        console.log(`Validation complete. Processed ${referenceList.length} references`);
        
        // Send completion message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', total: referenceList.length })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error in validate-references function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
