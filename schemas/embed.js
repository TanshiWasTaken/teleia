const { Schema, connection } = require('mongoose');
const db = connection.useDb('staff');

const embedSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: false },
    image: { type: String, required: false },
    footer: { type: String, required: false },
});

module.exports = db.model('Embed', embedSchema, 'embeds');