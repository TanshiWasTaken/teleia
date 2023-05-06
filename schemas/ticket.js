const { Schema, connection } = require('mongoose');
const db = connection.useDb('staff');

const ticketSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: { type: String, required: true },
    category: { type: String, required: true },
    reason: { type: String, required: false },
    author: { type: String, required: true },
    channel: { type: String, required: false },
    open: { type: Boolean, required: true },
    saved: { type: Boolean, required: false },
    pinned: { type: Boolean, required: false },
    summary: { type: String, required: false },
    claimedBy: { type: String, required: false },
    handledBy: { type: Array, required: false },
    users: { type: Array, required: false },
    closedBy: { type: String, required: false },
    notes: { type: Array, required: false },
});

module.exports = db.model('Ticket', ticketSchema, 'tickets');