import mongoose, { models } from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Market'
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    outcome: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['locked', 'won', 'lost', 'cancelled'],
        default: 'locked'
    }
}, {timestamps: true})

const Order = models.Order || mongoose.model('Order', orderSchema)

export default Order