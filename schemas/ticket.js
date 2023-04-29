const { Schema, connection } = require('mongoose');
const db = connection.useDb('staff');

const ticketSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    author: { type: String, required: true },
    channel: { type: String, required: false },
    open: { type: Boolean, required: true },
    locked: { type: Boolean, required: false },
    sticky: { type: Boolean, required: false },
    reason: { type: String, required: false },
    claimedBy: { type: String, required: false },
    handledBy: { type: Array, required: false },
    closedBy: { type: String, required: false },
});

module.exports = db.model('Ticket', ticketSchema, 'tickets');