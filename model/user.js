import mongoose from 'mongoose';
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar'
const { Schema, model} = mongoose;

const userSchema = new Schema({
  name: {
      type: String,
      default: 'Guest'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      const reg = /\S+@\S+\.\S+/
      return reg.test(String(value).trim().toLowerCase())
    }
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250'}, true)
    }
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required'],
    default: randomUUID(),
  }
}, {
    versionKey: false, timestamps: true, toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      } 
    }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(6)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)
  
export default User