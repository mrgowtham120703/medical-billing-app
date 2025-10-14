const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim')
const claimQueue = require('../jobs/claimValidatorJob');

// Create Claim

router.post('/', async(req, res)=>{
    const c = new Claim({...req.body, status: 'Submitted'});
    await c.save();

    // enqueue validation

    await claimQueue.addClaimForValidation(c._id);
    res.status(201).json(c);
});

router.get('/:id', async (req, res)=>{
    const c = await Claim.findById(req.params.id);
    if(!c) 
        return res.status(404).json({error: 'not found'});
    res.json(c);
});

router.get('/', async (req, res)=> {
    const list = await Claim.find().Sort({createdAt: -1}.limit(200));
    res.json(list);
});

module.exports = router;