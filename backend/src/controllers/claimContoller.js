const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

router.post('/', async (req, res)=>{
    const patient = new Patient(req.body);
})