import { Types } from 'mongoose';

export interface TeamIf { 
    name: string;
    description: string;
    department: Types.ObjectId;
    members: Types.ObjectId[];
    createdAt: Date;
    createdBy: Types.ObjectId;
    updatedAt: Date;
    updatedBy: Types.ObjectId;
    workspaces: Types.ObjectId[];
    projects: Types.ObjectId[];
    maxLimit: number;
    lastActive: Date;
}