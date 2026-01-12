import mongoose, { models } from "mongoose"

const platformRevenueSchema = new mongoose.Schema({
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Market'
    },
    revenue: {
        type: Number,
        required: true
    },
    feePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    currency: {
        type: String,
        enum: ['USD', 'INR'],
        default: 'INR'
    },
    settlementDate: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const PlatformRevenue = models.PlatformRevenue || mongoose.model('PlatformRevenue', platformRevenueSchema)
export default PlatformRevenue