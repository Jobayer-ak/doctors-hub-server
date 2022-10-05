const Slot = require("../models/slots.model")

exports.getSlotsService = async () =>{
    const result = await Slot.find({});

    return result;
}