// Simplified job runner using setImmediate queue (no redis required for MVP)

const Claim = require('../models/Claim');
const Patient = require('../models/Patient');
const calculateClaim = require('../utils/calculateClaim');

async function validateClaim(claimId) {
    
    const claim = await Claim.findById(claimId);
    if(!claim) return;
    claim.status = 'in_validation';
    await claim.save();

    // Simple validation : patient exists and insurance active

    const patient = await Patient.findById(claim.patientId);
    if(!patient){
        claim.status = 'rejected';
        claim.history = claim.history || [];
        claim.history.push({action:'reject', reason: 'Patient not found', at: new Date() });
        await claim.save();
        return;
    }

    const insurance = patient.insurance;
    const now = new Date();
    if(!insurance || (insurance.coverageStart && insurance.coverageStart > now) || (insurance.coverageEnd && insurance.coverageEnd < now)){
        claim.status = 'rejected';
        claim.history = claim.history || [];
        claim.history.push({actoin: 'reject', reason: 'Insurance not Active', at: new Date() });
        await claim.save();
        return;
    }

    //Perform calculation
    
    const calc = calculation(claim, insurance);
    claim.calculated = calc;
    claim.status = 'validated';
    claim.history = claim.history || [];
    claim.history.push({action: 'validated', at: new Date() });
    await claim.save();
}

module.exports = {
    //emulate a queue by calling setImmediate
    addClaimForValidation: async (claimId) => {
        setImmediate(()=> validateClaim(String(claimId)).catch(console.error));

    }
};