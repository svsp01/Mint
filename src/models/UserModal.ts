import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  phoneNumber: String,
  monthlyIncome: Number,
  profileImageUrl: String,
  bio: String,
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }]  // Reference to Budget model
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
