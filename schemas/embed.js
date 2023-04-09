const { Schema, model } = require('mongoose');

const embedSchema = new Schema({
    _id: Schema.Types.ObjectId,
    content: { type: String, required: true },
    thumbnail: { type: String, required: false },
    image: { type: String, required: false },
});

module.exports = model('Embed', embedSchema, 'embeds');