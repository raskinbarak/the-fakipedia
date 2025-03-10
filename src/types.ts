export interface Article {
    id: string;
    title: string;
    snippet: string;
    isFake: boolean;
    url?: string;  // URL of the true article (only real articles will have a URL)
  }
