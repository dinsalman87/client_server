import mongoose from 'mongoose';

const treatmentSchema = mongoose.Schema({
    number : String,
    information : String,
    date : {
        type : Date,
        default : new Date(),
    },
    workerEmail : String,
    carNumber : String,
})

const Treatment = mongoose.model('Treatment', treatmentSchema)

export default Treatment;