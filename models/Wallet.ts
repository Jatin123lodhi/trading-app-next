import mongoose, { models } from "mongoose";

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    lockedBalance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR'
    }
})

walletSchema.index({userId: 1, currency: 1})

const Wallet = models.Wallet || mongoose.model('Wallet', walletSchema)
export default Wallet