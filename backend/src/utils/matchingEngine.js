
// WEIGHTS
const WEIGHTS = {
    religion: 20,  
    caste: 10,   
    maritalStatus: 10,   
    wantKids: 10,   
    diet: 8,   
    values: 8,    
    familyPreference: 6,   
    languages: 6, 
    marriageTimeline: 6,
    age: 5,
    height: 4, 
    income: 4, 
    relocation: 3, 
};


// HELPERS 
function getAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function overlapCount(arr1 = [], arr2 = []) {
    return arr1.filter(v => arr2.includes(v)).length;
}

// SCORING FUNCTIONS

/**
 * Religion — 20 pts
 * Same religion = full points. Different = 0.
 * Most Indian matrimonial users filter strictly by religion first.
 */
function scoreReligion(customer, candidate) {
    if (!customer.religion || !candidate.religion) return { points: 0, reason: null };
    if (customer.religion === candidate.religion) {
        return { points: WEIGHTS.religion, reason: `Same religion (${customer.religion})` };
    }
    return { points: 0, reason: null };
}

/**
 * Caste — 10 pts
 * Same caste = full. Other/null = partial (5pts). Different = 0.
 */
function scoreCaste(customer, candidate) {
    if (!customer.caste || !candidate.caste) return { points: 5, reason: "Caste not specified (open)" };
    if (customer.caste === "OTHER" || candidate.caste === "OTHER") {
        return { points: 5, reason: "Open to all castes" };
    }
    if (customer.caste === candidate.caste) {
        return { points: WEIGHTS.caste, reason: `Same caste (${customer.caste})` };
    }
    return { points: 0, reason: null };
}

/**
 * Marital Status — 10 pts
 * SINGLE + SINGLE = full. SINGLE matching DIVORCED/WIDOWED = partial.
 * DIVORCED + DIVORCED = full (they understand each other).
 */
function scoreMaritalStatus(customer, candidate) {
    const c = customer.maritalStatus;
    const d = candidate.maritalStatus;
    if (c === d) return { points: WEIGHTS.maritalStatus, reason: `Both ${c.toLowerCase()}` };
    if (c === "SINGLE" && (d === "DIVORCED" || d === "WIDOWED")) {
        return { points: 5, reason: "Open to previously married candidates" };
    }
    if ((c === "DIVORCED" || c === "WIDOWED") && d === "SINGLE") {
        return { points: 5, reason: "Candidate is single" };
    }
    return { points: 3, reason: null };
}

/**
 * Want Kids — 10 pts
 * YES/YES or NO/NO = full. MAYBE = partial. YES/NO = 0 (dealbreaker).
 */
function scoreWantKids(customer, candidate) {
    const c = customer.wantKids;
    const d = candidate.wantKids;
    if (c === d) return { points: WEIGHTS.wantKids, reason: `Both feel the same about having kids (${c})` };
    if (c === "MAYBE" || d === "MAYBE") return { points: 5, reason: "Open to discussion about kids" };
    // YES vs NO — fundamental mismatch
    return { points: 0, reason: null };
}

/**
 * Diet — 8 pts
 * Vegetarians strongly prefer vegetarians (cultural/religious).
 * Non-veg people are more flexible.
 */
function scoreDiet(customer, candidate) {
    const c = customer.diet;
    const d = candidate.diet;

    if (!c || !d) return { points: 4, reason: null };
    if (c === d) {
        return {
            points: WEIGHTS.diet,
            reason: `Same dietary preference (${c})`
        };
    }
    if (
        (c === "VEGETARIAN" && d === "VEGAN") ||
        (c === "VEGAN" && d === "VEGETARIAN")
    ) {
        return {
            points: WEIGHTS.diet / 2,
            reason: "Similar dietary preferences"
        };
    }
    if (
        (c === "VEGETARIAN" && d === "NON_VEGETARIAN") ||
        (c === "NON_VEGETARIAN" && d === "VEGETARIAN")
    ) {
        return { points: 0, reason: null };
    }
    if (
        (c === "VEGAN" && d === "NON_VEGETARIAN") ||
        (c === "NON_VEGETARIAN" && d === "VEGAN")
    ) {
        return { points: 0, reason: null };
    }

    return { points: 0, reason: null };
}

/**
 * Shared Values — 8 pts
 * Scored by how many values overlap. More overlap = more points.
 */
function scoreValues(customer, candidate) {
    const shared = overlapCount(customer.values, candidate.values);
    const sharedList = customer.values
        .filter(v => candidate.values.includes(v));
    if (shared >= 4) {
        return {
            points: WEIGHTS.values,
            reason: `Strong value match: ${sharedList.join(", ")}`
        };
    }
    if (shared >= 2) {
        return {
            points: WEIGHTS.values / 2,
            reason: `Shared values: ${sharedList.join(", ")}`
        };
    }
    return { points: 0, reason: null };
}

/**
 * Family Preference — 6 pts
 * JOINT/JOINT or NUCLEAR/NUCLEAR = full. NO_PREFERENCE = partial.
 */
function scoreFamilyPreference(customer, candidate) {
    const c = customer.familyPreference;
    const d = candidate.familyPreference;
    if (!c || !d) return { points: 3, reason: null };
    if (c === d) return { points: WEIGHTS.familyPreference, reason: `Same family preference (${c})` };
    if (c === "NO_PREFERENCE" || d === "NO_PREFERENCE") {
        return { points: 4, reason: "Flexible on family living arrangement" };
    }
    return { points: 0, reason: null };
}

/**
 * Languages — 6 pts
 * Shared languages = comfort and connection. 
 * More overlap = more points.
 */
function scoreLanguages(customer, candidate) {
    const shared = overlapCount(customer.languagesKnown, candidate.languagesKnown);
    if (shared === 0) return { points: 0, reason: null };
    const points = Math.min(WEIGHTS.languages, shared * 1.5);
    const sharedLangs = customer.languagesKnown
        .filter(l => candidate.languagesKnown.includes(l));
    return {
        points,
        reason: `Speaks ${sharedLangs.join(" & ")}`
    };
}

/**
 * Marriage Timeline — 6 pts
 * Exact match = full. Adjacent = partial. Far apart = 0.
 */
function scoreMarriageTimeline(customer, candidate) {
    const order = ["WITHIN_1_YEAR", "1_2_YEARS", "2_3_YEARS", "3_PLUS_YEARS"];
    const c = order.indexOf(customer.marriageTimeline);
    const d = order.indexOf(candidate.marriageTimeline);
    if (c === -1 || d === -1) return { points: 3, reason: null };
    const diff = Math.abs(c - d);
    if (diff === 0) return { points: WEIGHTS.marriageTimeline, reason: "Same marriage timeline" };
    if (diff === 1) return { points: 3, reason: "Similar marriage timeline" };
    return { points: 0, reason: null };
}

/**
 * Age — 5 pts
 * Gender-aware logic based on real matrimonial site patterns:
 * - Male customer: prefers candidate 1–7 yrs younger
 * - Female customer: prefers candidate 1–5 yrs older
 * - OTHER: within 5 years either way
 */
function scoreAge(customer, candidate) {
    const customerAge = getAge(customer.dateOfBirth);
    const candidateAge = getAge(candidate.dateOfBirth);
    const diff = candidateAge - customerAge; // negative = candidate is younger

    if (customer.gender === "MALE") {
        // Male prefers younger female: ideal -1 to -6
        if (diff >= -6 && diff <= -1) return { points: WEIGHTS.age, reason: `Good age pairing (${candidateAge} yrs)` };
        if (diff >= -8 && diff <= 2) return { points: 3, reason: `Acceptable age gap` };
        return { points: 0, reason: null };
    }

    if (customer.gender === "FEMALE") {
        // Female prefers slightly older male: ideal +1 to +5
        if (diff >= 1 && diff <= 5) return { points: WEIGHTS.age, reason: `Good age pairing (${candidateAge} yrs)` };
        if (diff >= -2 && diff <= 8) return { points: 3, reason: `Acceptable age gap` };
        return { points: 0, reason: null };
    }

    // OTHER: within 5 years either direction
    if (Math.abs(diff) <= 5) return { points: WEIGHTS.age, reason: `Close in age (${candidateAge} yrs)` };
    if (Math.abs(diff) <= 8) return { points: 2, reason: null };
    return { points: 0, reason: null };
}

/**
 * Height — 4 pts
 * Male customer: prefers candidate shorter (realistic preference)
 * Female customer: prefers candidate taller
 * OTHER: neutral, just not extreme difference
 */
function scoreHeight(customer, candidate) {
    const diff = candidate.heightCm - customer.heightCm; // positive = candidate is taller

    if (customer.gender === "MALE") {
        // Prefers shorter candidate
        if (diff >= -20 && diff <= -5) return { points: WEIGHTS.height, reason: null };
        if (diff >= -25 && diff <= 0) return { points: 2, reason: null };
        return { points: 0, reason: null };
    }

    if (customer.gender === "FEMALE") {
        // Prefers taller candidate
        if (diff >= 5 && diff <= 20) return { points: WEIGHTS.height, reason: null };
        if (diff >= 0 && diff <= 25) return { points: 2, reason: null };
        return { points: 0, reason: null };
    }

    // OTHER: neutral
    if (Math.abs(diff) <= 15) return { points: WEIGHTS.height, reason: null };
    return { points: 2, reason: null };
}

/**
 * Income — 4 pts
 * Male customer: prefers candidate earning less or equal (traditional pattern)
 * Female customer: prefers candidate earning equal or more
 * OTHER: neutral, just not a huge mismatch
 */
function scoreIncome(customer, candidate) {
    const diff = candidate.incomeLpa - customer.incomeLpa; 

    if (customer.gender === "MALE") {
        if (diff <= 0) return { points: WEIGHTS.income, reason: null }; 
        if (diff <= 10) return { points: 2, reason: null };
        return { points: 0, reason: null };
    }

    if (customer.gender === "FEMALE") {
        if (diff >= 0) return { points: WEIGHTS.income, reason: `Strong professional match` }; 
        if (diff >= -10) return { points: 2, reason: null }; 
        return { points: 0, reason: null };
    }

    // OTHER: neutral, just not more than 30 LPA difference
    if (Math.abs(diff) <= 30) return { points: WEIGHTS.income, reason: null };
    return { points: 2, reason: null };
}

/**
 * Relocation — 3 pts
 * Both YES = full. One MAYBE = partial. YES + NO = 0.
 */
function scoreRelocation(customer, candidate) {
    const c = customer.openToRelocate;
    const d = candidate.openToRelocate;
    if (c === "YES" && d === "YES") return { points: WEIGHTS.relocation, reason: "Both open to relocation" };
    if (c === "YES" && d === "MAYBE") return { points: 2, reason: null };
    if (c === "MAYBE" && d === "YES") return { points: 2, reason: null };
    if (c === "MAYBE" && d === "MAYBE") return { points: 2, reason: null };
    if (c === "NO" && d === "NO") return { points: WEIGHTS.relocation, reason: "Neither wants to relocate" };
    return { points: 0, reason: null };
}

//  LABEL GENERATOR 

function getLabel(score) {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Strong Match";
    if (score >= 55) return "Good Match";
    if (score >= 40) return "Potential Match";
    return "Low Compatibility";
}

// PREFERENCE HARD FILTER

function passesPreferenceFilter(candidate, preferences) {
    if (!preferences) return true; // no preferences set — everyone passes

    const candidateAge = getAge(candidate.dateOfBirth);

    // Age range
    if (preferences.preferredAgeMin && candidateAge < preferences.preferredAgeMin) return false;
    if (preferences.preferredAgeMax && candidateAge > preferences.preferredAgeMax) return false;

    // Height range
    if (preferences.preferredHeightMin && candidate.heightCm < preferences.preferredHeightMin) return false;
    if (preferences.preferredHeightMax && candidate.heightCm > preferences.preferredHeightMax) return false;

    // Income minimum
    if (preferences.preferredIncomeMin && candidate.incomeLpa < preferences.preferredIncomeMin) return false;

    // Preferred religions (if list is non-empty, candidate must be in it)
    if (preferences.preferredReligions?.length > 0) {
        if (!candidate.religion || !preferences.preferredReligions.includes(candidate.religion)) return false;
    }

    // Preferred castes
    if (preferences.preferredCastes?.length > 0) {
        if (!candidate.caste || !preferences.preferredCastes.includes(candidate.caste)) return false;
    }

    // Preferred diets
    if (preferences.preferredDiets?.length > 0) {
        if (!candidate.diet || !preferences.preferredDiets.includes(candidate.diet)) return false;
    }

    // Preferred cities (candidate must live in one of them)
    if (preferences.preferredCities?.length > 0) {
        if (!candidate.city || !preferences.preferredCities.includes(candidate.city)) return false;
    }

    // Preferred countries
    if (preferences.preferredCountries?.length > 0) {
        if (!candidate.country || !preferences.preferredCountries.includes(candidate.country)) return false;
    }

    // Deal breakers — if candidate has any dealbreaker value in their profile
    // dealBreakers is a free-form list of things like ["SMOKER", "DRINKER", "DIVORCED"]
    if (preferences.dealBreakers?.length > 0) {
        for (const breaker of preferences.dealBreakers) {
            if (breaker === "SMOKER" && candidate.smoking === "YES") return false;
            if (breaker === "DRINKER" && candidate.drinking === "YES") return false;
            if (breaker === "DIVORCED" && candidate.maritalStatus === "DIVORCED") return false;
            if (breaker === "WIDOWED" && candidate.maritalStatus === "WIDOWED") return false;
            if (breaker === "NON_VEGETARIAN" && candidate.diet === "NON_VEGETARIAN") return false;
            if (breaker === "SMOKER" && candidate.smoking === "OCCASIONALLY") return false;
        }
    }

    return true;
}

// MAIN ENGINE 

export function matchCustomer(customer, candidateProfiles) {
    const results = [];
    const preferences = customer.preferences ?? null;

    for (const candidate of candidateProfiles) {
        // Skip self
        if (candidate.id === customer.id) continue;

        // Skip same gender (heterosexual-first logic — can be made configurable)
        if (candidate.gender === customer.gender) continue;

        // ── HARD FILTER: customer's stated preferences ──
        if (!passesPreferenceFilter(candidate, preferences)) continue;

        // ── SCORING: compatibility engine ──
        const scorers = [
            scoreReligion(customer, candidate),
            scoreCaste(customer, candidate),
            scoreMaritalStatus(customer, candidate),
            scoreWantKids(customer, candidate),
            scoreDiet(customer, candidate),
            scoreValues(customer, candidate),
            scoreFamilyPreference(customer, candidate),
            scoreLanguages(customer, candidate),
            scoreMarriageTimeline(customer, candidate),
            scoreAge(customer, candidate),
            scoreHeight(customer, candidate),
            scoreIncome(customer, candidate),
            scoreRelocation(customer, candidate),
        ];

        const totalScore = scorers.reduce((sum, s) => sum + s.points, 0);
        const reasons = scorers
            .map(s => s.reason)
            .filter(Boolean);

        results.push({
            customerId: customer.id,
            suggestedCustomerId: candidate.id,
            candidate: candidate,
            score: Math.min(100, totalScore),
            reasons,
            label: getLabel(totalScore),
        });
    }


    return results.sort((a, b) => b.score - a.score);
}