import mongoose, { Document } from "mongoose";

export interface IUserRequestCoolDownSchema extends Document {
  discordId: string;
  address: string;
  chain: string;
  token: string;
  lastRequestDate: number;
}

const UserRequestCoolDownSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: [true, "DiscordUserId not found"],
  },
  address: {
    type: String,
    required: [true, "No address found"],
  },
  chain: { type: String, required: [true, "No chain/network found"] },
  token: { type: String, required: [true, "No token detail found"] },
  lastRequestDate: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<IUserRequestCoolDownSchema>(
  "UserRequestCoolDown",
  UserRequestCoolDownSchema
);
