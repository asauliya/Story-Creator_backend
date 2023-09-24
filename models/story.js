const mongoose = require('mongoose');
const { Schema } = mongoose;

const StorySchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    prompt:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
  });

  module.exports = mongoose.model('Story', StorySchema);