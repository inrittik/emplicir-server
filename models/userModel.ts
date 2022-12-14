import { Schema, model } from "mongoose";
import validator from "validator";
import toJSON from "./plugins/toJSON.plugin"
import paginate from "./plugins/paginate.plugin";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {UserIf} from "../interfaces/User"

const UserSchema = new Schema<UserIf>({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    require: [true, "Enter an email address."],
    validate: [validator.isEmail, "Enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Enter a password"],
    minlength: [8, "Password should be at least 8 characters"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "NA"],
    default: "NA",
  },
  dateOfBirth: {
    type: Date,
    trim: true,
  },
  mobile: {
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  auth: {
    otp: {
      type: {
        code: {
          type: Number,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    },
    passwordResetKey: { type: String },
    passwordResetDate: { type: Date },
    passwordResetUsed: { type: Boolean },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number },
    accountDeactivated: { type: Boolean, default: false },
  },
  address: {
    country: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    line1: {
      type: String,
    },
    line2: {
      type: String,
    },
    pinCode: {
      type: String,
    },
  },
  teams: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  workspaces: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  isStillEmployeed: {
    type: Boolean,
    default: false,
  },
  employeedSince: Date,
  employeedTill: Date,
  subordinates: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  superordinates: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  personalInfoCompleted: {
    type: Boolean,
    default: false,
  },
  branch: {
    type: Schema.Types.ObjectId,
  },
  department: {
    type: Schema.Types.ObjectId,
  },
});


// add plugin that converts mongoose to json
UserSchema.plugin(toJSON)
UserSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(process.env.SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});


UserSchema.methods.generateToken = function (expiry = "7d") {
  const payload = {
    id: this._id,
    username: this.username,
    role: this.role || "user",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return await bcrypt.compare(data, this.password);
};

UserSchema.statics.findByEmail = function (email, callback) {
  if (!email) {
    return callback(new Error("errors.missingEmail"), null);
  } else {
    this.findOne({ email: email }, function (err, user) {
      return callback(err, user);
    });
  }
};


const User = model<UserIf>("User", UserSchema);
module.exports = User;
