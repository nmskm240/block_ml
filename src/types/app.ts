export interface UserProfile {
  id: string;
  name: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDetail extends ProjectSummary {
  blocklyJson: string;
}
