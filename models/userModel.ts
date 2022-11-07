import { Schema, Types, model } from "mongoose";
import validator from "validator";

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
});

const User = model<UserIf>("User", UserSchema);
module.exports = User;
