const { Schema, connection } = require('mongoose');
const db = connection.useDb('staff');

const statsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    nSupport: { type: Number, required: true },
    nConnections: { type: Number, required: true },
    nReport: { type: Number, required: true },
    nAppeal: { type: Number, required: true },
    nVerify: { type: Number, required: true },
    veryBad: { type: Number, required: true },
    bad: { type: Number, required: true },
    neutral: { type: Number, required: true },
    good: { type: Number, required: true },
    veryGood: { type: Number, required: true },
});

module.exports = db.model('StatsTickets', statsSchema, 'stats');