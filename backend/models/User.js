import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
  },
  provider: {
    type: String,
    default: 'local', 
  },
 cartData:{type:Object,default:{}},
  password: {
    type: String,
    default: '',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

export default mongoose.model('User', userSchema);