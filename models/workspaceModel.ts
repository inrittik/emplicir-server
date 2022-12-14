import { Schema, model } from "mongoose";
import toJSON from "./plugins/toJSON.plugin";
import paginate from "./plugins/paginate.plugin";
import { WorkspaceIf } from "../interfaces/Workspace";

const WorkspaceSchema = new Schema<WorkspaceIf>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    team: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    createdAt: {
        type: Date,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
    },
    projectsCompleted: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    projectsInProgress: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    projectsOnHold: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    projectsCancelled: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    projectUnderReview: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    meetings: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
});

// add plugin that converts mongoose to json
WorkspaceSchema.plugin(toJSON)
WorkspaceSchema.plugin(paginate);

/**
 * Get workspace by id
 * @typedef Workspace
 * @param {number} id
*/
WorkspaceSchema.statics.getWorkspaceById = async function (id: string) { 
    return this.findById(id);
}

const Workspace = model<WorkspaceIf>("Workspace", WorkspaceSchema);
module.exports = Workspace;