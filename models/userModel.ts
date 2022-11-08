import { Schema, Types, model } from "mongoose";
import validator from "validator";
const { toJson, paginate } = require("./plugins");
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface UserIf {
  username?: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  avatar?: {
    public_id: string;
    url: string;
  };
  gender: string;
  dateOfBirth?: Date;
  role: string;
  mobile: {
    countryCode: string;
    phoneNumber: string;
  };
  isMobileVerified: boolean;
  auth: {
    otp: {
      code: number;
      createdAt: Date;
    };
    passwordResetKey: string;
    passwordResetDate: Date;
    passwordResetUsed: boolean;
    loginAttempts: number;
    accountDeactivated: boolean;
    lockUntil: number;
  };
  address: {
    country: string;
    state: string;
    city: string;
    line1: string;
    line2: string;
    pinCode: string;
  };
  teams?: Types.ObjectId[];
  workspaces?: Types.ObjectId[];
  isStillEmployeed: boolean;
  employeedSince?: Date;
  employeedTill?: Date;
  subordinates?: Types.ObjectId[];
  superordinates?: Types.ObjectId[];
  personalInfoCompleted: boolean;
  branch: Types.ObjectId;
  department: Types.ObjectId;
}

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
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    },
    passwordResetKey: { type: String },
    passwordResetDate: { type: Date },
    passwordResetUsed: { type: Boolean },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
    accountDeactivated: { type: Boolean, default: false },
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
    },
    pinCode: {
      type: String,
      required: true,
    },
  },
  teams: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
  workspaces: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
  isStillEmployeed: {
    type: Boolean,
    required: true,
    default: false,
  },
  employeedSince: Date,
  employeedTill: Date,
  subordinates: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
  superordinates: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
  personalInfoCompleted: {
    type: Boolean,
    default: false,
  },
  branch: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});


// add plugin that converts mongoose to json
UserSchema.plugin(toJson)
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
