const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: String, required: true },
    creator: { type: String, required: true }
});

taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
