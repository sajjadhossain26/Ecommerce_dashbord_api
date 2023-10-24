
import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: Array,
        default: [],
    },
    status:{
        type: Boolean,
        default: true,
    },
    trash: {
        type: Boolean,
        default: false
    }
    
},{
    timestamps: true
}) 

export default mongoose.model('Role', roleSchema)