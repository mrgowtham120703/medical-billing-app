// Very small rule engine to compute allowed amounts, deductable, coinsurance

module.exports = function calculateClaim(claim, insurance) {

    // compute billed amount from item if not provided

    let billed = claim.billedAmount || 0;
    if (!claim.billedAmount) {
        billed = 0;
        (claim.procedures || []).forEach(p => billed += (p.unicost || 0) * (p.qty || 1));
        (claim.medications || []).forEach(m => billed += (m.unicost || 0) * (m.qty || 1));
        if (claim.bedDays) billed += (claim.bedDays * 500); // SIMPLE BED RATE
        if (claim.ambulancedUsed) billed += (claim.ambulanceCharge || 0);
    }

    // allowed amount: naive - insurer allowa 80% of billed by default

    const allowed = billed * 0.8;

    const remainingDed = Math.max(0, (insurance.deductableTotal || 0) - (insurance.deductableUsed || 0));
    const dedApplied = Math.min(allowed, remainingDed);
    const insurerBase = allowed - dedApplied;
    const coinsurance = insurerBase * ((insurance.coPayPercent || 0) / 100);
    const patientResp = dedApplied + coinsurance + Math.max(0, billed - allowed);
    const insurerResp = Math.max(0, allowed - coinsurance - dedApplied);

    return {
        billed,
        allowed,
        deductibleApplied: dedApplied,
        coinsuranceApplied: coinsurance,
        patientResponsibility: patientResp,
        insurerResponsibilty: insurerResp,
    };
}