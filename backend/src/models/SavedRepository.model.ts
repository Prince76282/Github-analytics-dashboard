import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedRepository extends Document {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  githubId?: number;
  savedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SavedRepositorySchema = new Schema<ISavedRepository>(
  {
    owner: {
      type: String,
      required: [true, 'Repository owner is required'],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full repository name is required'],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    htmlUrl: {
      type: String,
      required: [true, 'Repository HTML URL is required'],
      trim: true,
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
    },
    forks: {
      type: Number,
      default: 0,
      min: 0,
    },
    language: {
      type: String,
      default: null,
      trim: true,
    },
    githubId: {
      type: Number,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index on owner and name to strictly prevent duplicate entries
SavedRepositorySchema.index({ owner: 1, name: 1 }, { unique: true });
SavedRepositorySchema.index({ savedAt: -1 });

export const SavedRepositoryModel = mongoose.model<ISavedRepository>(
  'SavedRepository',
  SavedRepositorySchema
);
