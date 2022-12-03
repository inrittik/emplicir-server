import { Types } from "mongoose";

export interface UserIf {
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
