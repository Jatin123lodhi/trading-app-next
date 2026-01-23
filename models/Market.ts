import mongoose, { models } from "mongoose";

const marketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },

    status: {
        type: String,
        enum: ['open', 'closed', 'settled'],
        default: 'open'
    },
    endDate: {
        type: Date,
        required: true
    },
    winningOutcome: {
        type: String,
        enum: ['Yes', 'No']
    },
    totalBetAmount: {
        type: {
            yes: {
                type: Number,
                default: 0
            },
            no: {
                type: Number,
                default: 0
            }
        },
        default: () => ({ yes: 0, no: 0 })
    }
}, {timestamps: true})

const Market = models.Market || mongoose.model('Market', marketSchema)

export default Market

