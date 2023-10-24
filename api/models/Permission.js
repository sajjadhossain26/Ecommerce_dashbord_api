
import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
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

export default mongoose.model('Permission', permissionSchema)