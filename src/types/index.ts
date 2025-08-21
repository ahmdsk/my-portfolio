export interface Project {
  id: string;
  title: string;
  description: string;
  cover?: string;
  tags?: string[];
  url?: string;
  createdAt?: Date;
}

export interface Saran {
  id: string;
  name: string;
  message: string;
  userId: string;
  createdAt?: Date;
}
