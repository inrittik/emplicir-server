import { Types } from "mongoose";

export interface ProjectIf {
  name: string;
  description: string;
  workspace: Types.ObjectId;
  team: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt: Date;
  updatedBy: Types.ObjectId;
  tasks: Types.ObjectId[];
  tasksCompleted: Types.ObjectId[];
  tasksInProgress: Types.ObjectId[];
  tasksOnHold: Types.ObjectId[];
  tasksCancelled: Types.ObjectId[];
  taskUnderReview: Types.ObjectId[];
  disputes: Types.ObjectId[];
  feedbacks: Types.ObjectId[];
  milestones: Types.ObjectId[];
  lead: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: string;
  budgetRange: {
    min: number;
    max: number;
  };
  projectFiles: [
    {
      url: string;
      filename: string;
    }
  ];
  githubRepo: string;
  githubRepoUrl: string;
}
