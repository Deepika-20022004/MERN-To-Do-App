const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  versionKey: false
});

// Add pre-save middleware to ensure text is not empty
TodoSchema.pre('save', function(next) {
  if (this.text && this.text.trim() === '') {
    next(new Error('Text cannot be empty'));
  } else {
    next();
  }
});

module.exports = mongoose.model("Todo", TodoSchema);
