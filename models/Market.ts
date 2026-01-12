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
    }
}, {timestamps: true})

const Market = models.Market || mongoose.model('Market', marketSchema)

export default Market

