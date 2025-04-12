export interface ClaimTypes {
    claim: string;
    verdict: string;
    articles: {
        title: string;
        link: string;
        snippet: string;
        pubDate: string;
        source: string;
        category: string;
        image?: string | null;
    }
}