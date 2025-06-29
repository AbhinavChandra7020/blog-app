import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
    { 
    // basic schema data
        title: {
            type: String,
            required: [true, 'Enter a title'],
            trim: true
        },
        content: {
            type: String,
            required: [true, 'Enter appropriate content data'],
            trim: true
        },
        slug: {
            type: String,
            required: [true, 'Enter proper slugified data'],
            unique: true,
            lowercase: true,
        },
    // SEO tag fields
        metaTitle: {
            type: String,
            trim: true,
        },
        metaDescription: {
            type: String,
            trim: true,
        }
    }, 
    {
        // automatic createdAt and updatedAt fields
        timestamps: true
    }
)

export default mongoose.models.Post || mongoose.model('Post', PostSchema)