import { Types } from "mongoose";

export interface WorkspaceIf { 
    name: string;
    description: string;
    team: Types.ObjectId;
    projects: Types.ObjectId[];
    members: Types.ObjectId[];
    createdAt: Date;
    createdBy: Types.ObjectId;
    updatedAt: Date;
    updatedBy: Types.ObjectId;
    projectsCompleted: Types.ObjectId[];
    projectsInProgress: Types.ObjectId[];
    projectsOnHold: Types.ObjectId[];
    projectsCancelled: Types.ObjectId[];
    projectUnderReview: Types.ObjectId[];
    meetings: Types.ObjectId[];
}