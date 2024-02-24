const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const hospitalDataPath = path.join(__dirname, 'hospitalData.json');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Read data from the JSON file
const readHospitalData = async () => {
  try {
    const data = await fs.readFile(hospitalDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading hospital data:', error);
    return [];
  }
};

// Write data to the JSON file
const writeHospitalData = async (data) => {
  try {
    await fs.writeFile(hospitalDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing hospital data:', error);
  }
};

// API CRUD
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await readHospitalData();
    console.log('Hospitals:', hospitals);
    res.send(hospitals);
  } catch (error) {
    console.error('Error handling GET request:', error);
    res.status(500).send('Something went wrong!');
  }
});

router.post('/hospitals/add', async (req, res) => {
  try {
    const newHospital = req.body;
    const hospitals = await readHospitalData();
    hospitals.push(newHospital);
    await writeHospitalData(hospitals);
    res.send({ message: 'Hospital added', hospitals });
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).send('Something went wrong!');
  }
});

router.put('/hospitals/edit/:name', async (req, res) => {
  try {
    const hospitalName = req.params.name;
    const updatedData = req.body;
    const hospitals = await readHospitalData();
    const index = hospitals.findIndex(hospital => hospital.name === hospitalName);
    if (index !== -1) {
      hospitals[index] = { ...hospitals[index], ...updatedData };
      await writeHospitalData(hospitals);
      res.send({ message: 'Hospital updated', hospitals });
    } else {
      res.status(404).send({ message: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error handling PUT request:', error);
    res.status(500).send('Something went wrong!');
  }
});

router.delete('/hospitals/remove/:name', async (req, res) => {
  try {
    const hospitalName = req.params.name;
    const hospitals = await readHospitalData();
    const filteredHospitals = hospitals.filter(hospital => hospital.name !== hospitalName);
    if (hospitals.length !== filteredHospitals.length) {
      await writeHospitalData(filteredHospitals);
      res.send({ message: 'Hospital deleted', hospitals: filteredHospitals });
    } else {
      res.status(404).send({ message: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    res.status(500).send('Something went wrong!');
  }
});

module.exports = router;
