// Build AI context from portfolio database
import { db } from '@/db';
import type { PortfolioContext } from '@/types/chat';

export async function buildPortfolioContext(): Promise<PortfolioContext> {
  try {
    // Fetch all portfolio data in parallel
    const [techStackData, careerData, aboutData] = await Promise.all([
      db.query.techStack.findMany({
        columns: {
          title: true,
          description: true,
        },
      }),
      db.query.career.findMany({
        columns: {
          year: true,
          title: true,
          subtitle: true,
          description: true,
          techStack: true,
          keyProjects: true,
        },
        orderBy: (career, { desc }) => [desc(career.year)],
      }),
      db.query.about.findFirst({
        columns: {
          name: true,
          title: true,
          location: true,
          narrativeContent: true,
          interests: true,
        },
      }),
    ]);

    return {
      techStack: techStackData || [],
      career: careerData?.map(c => ({
        ...c,
        techStack: c.techStack || undefined,
        keyProjects: c.keyProjects || undefined,
      })) || [],
      about: aboutData ? {
        ...aboutData,
        interests: aboutData.interests || undefined,
      } : null,
    };
  } catch (error) {
    console.error('Error building portfolio context:', error);
    // Return empty context on error
    return {
      techStack: [],
      career: [],
      about: null,
    };
  }
}

// Get a summary of the context (useful for logging/debugging)
export function getContextSummary(context: PortfolioContext): string {
  return `Portfolio Context Summary:
- Tech Stack Items: ${context.techStack.length}
- Career Entries: ${context.career.length}
- About Info: ${context.about ? 'Available' : 'Not available'}`;
}
