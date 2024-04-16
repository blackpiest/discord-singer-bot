export interface QueueItem {
  id: string;
  url: string;
  name?: string;
  author?: {
    name: string;
    user: string;
    url: string;
  };
}