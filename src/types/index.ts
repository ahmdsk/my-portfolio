export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  cover?: string | null;     // URL img
  coverAlt?: string | null;  // optional alt
  tags?: string[] | null;
  url?: string | null;
  createdAt?: Date | null;
};


export interface Saran {
  id: string;
  name: string;
  message: string;
  userId: string;
  createdAt?: Date;
}
