import Treatment from "../models/treatment.js";

export const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find(
      {},
      { _id: 0, number: 1, information: 1, date: 1, carNumber: 1, workerEmail: 1 }
    );

    res.status(200).json(treatments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const addNewTreatment = async (req, res) => {
  const treatmentData = req.body;

  try {
    const newTreatment = new Treatment(treatmentData);
    await newTreatment.save();

    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteTreatment = async (req, res) => {
  const treatmentNumber = req.body.number;

  try {
    await Treatment.deleteOne({ number: treatmentNumber });
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const editTreatment = async (req, res) => {
  const treatmentData = req.body;

  try {
    await Treatment.updateOne({ number: treatmentData.number }, { $set: treatmentData });

    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
