import { Schema, model } from "mongoose";
import toJSON from "./plugins/toJSON.plugin";
import paginate from "./plugins/paginate.plugin";
import { ProjectIf } from "../interfaces/Project";
const { projectStatusEnums } = require("../utils/enums");

const ProjectSchema = new Schema<ProjectIf>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  workspace: {
    type: Schema.Types.ObjectId,
  },
  team: {
    type: Schema.Types.ObjectId,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
    },
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
  tasks: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  tasksCompleted: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  tasksInProgress: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  tasksOnHold: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  tasksCancelled: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  taskUnderReview: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  disputes: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  feedbacks: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  milestones: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  lead: {
    type: Schema.Types.ObjectId,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: projectStatusEnums,
    default: "inprogress",
    },
    budgetRange: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        }
    },
    projectFiles: [
        {
            url: {
                type: String,
            },
            filename: {
                type: String,
            }
        }
    ],
    githubRepo: {
        type: String,
    },
    githubRepoUrl: {
        type: String,
    }
});


// add plugin that converts mongoose to json
ProjectSchema.plugin(toJSON);
ProjectSchema.plugin(paginate);


/**
 * Check if projectId is taken
 * @param {ObjectId} projectId
 * @returns {boolean}
*/
ProjectSchema.statics.isProjectIdTaken = async function (projectId: string) { 
    const project = await this.findOne({ projectId });
    return !!project;
}

const Project = model<ProjectIf>("Project", ProjectSchema);
module.exports = Project;