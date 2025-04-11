import mongoose from 'mongoose';

// Define Schema
const promptSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  template: { type: String, required: true },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', promptSchema);
export default Prompt;