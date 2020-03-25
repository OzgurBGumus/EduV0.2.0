const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LReservationSchema = new Schema({
    reservationId: Number,
    reservationDateMinute: Number,
    reservationDateHour: Number,
    reservationDateDay: Number,
    reservationDateMonth: Number,
    reservationDateYear: Number,
    name: String,
    surname: String,
    email: String,
    nationality: String,
    residence: String,
    city: String,
    mobileNo: Number,
    communication: String,
    notes: String,
    schoolId: Number,
    programId: Number,
    startDateDay: Number,
    startDateMonth: Number,
    startDateYear: Number,
    accommodation: String,
    Paccommodation: String,
    airport: String,
    Pairport: String,
    hInsurance: String,
    PhInsurance: String
});

module.exports = mongoose.model('reservations', LReservationSchema);