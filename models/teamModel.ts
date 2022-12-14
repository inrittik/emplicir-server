import { Schema, model } from "mongoose";
import toJSON from "./plugins/toJSON.plugin";
import paginate from "./plugins/paginate.plugin";
import { TeamIf } from "../interfaces/Team";

const TeamSchema = new Schema<TeamIf>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    department: {
        type: Schema.Types.ObjectId,
        required: true,
    },
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
    workspaces: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    projects: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    maxLimit: {
        type: Number,
        default: 10,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    }
});

// add plugin that converts mongoose to json
TeamSchema.plugin(toJSON)
TeamSchema.plugin(paginate);

/**
 * Get team by id
 * @param {ObjectId} id
*/
TeamSchema.statics.getTeamById = async function (id: string) { 
    return this.findById(id);
}

const Team = model<TeamIf>("Team", TeamSchema);
module.exports = Team;