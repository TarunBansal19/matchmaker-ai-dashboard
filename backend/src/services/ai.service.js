import openai from "../config/openai.js";

function profileSummary(person) {

    return `Name: ${person.firstName} ${person.lastName}
    Gender: ${person.gender}
    City: ${person.city}
    Profession: ${person.designation} at ${person.company}
    Education: ${person.degree} from ${person.college}
    Relationship goal: ${person.relationshipGoal}
    Marriage timeline: ${person.marriageTimeline}
    Wants kids: ${person.wantKids}
    Open to relocate: ${person.openToRelocate}
    Diet: ${person.diet}
    Personality: ${person.personalityType}
    Family preference: ${person.familyPreference}
    Values: ${person.values?.join(", ")}`;
}

export async function generateMatchExplanation({ customer, candidate, score, reasons }) {

    const prompt = `
    You are a professional Indian matchmaking assistant.

    Generate a short explanation for why these two customers could be a good match.

    Customer 1 Profile: ${profileSummary(customer)}

    Customer 2 Profile: ${profileSummary(candidate)}

    Match Score: ${score}/100

    Rule-based reasons:
    ${reasons.join(", ")}

    Rules:
    - Keep it under 70 words.
    - Write only one short paragraph.
    - Be warm, human, and professional.
    - Do not overpromise.
    - Do not mention caste/religion directly.
    - Do not use markdown.
    - Focus on lifestyle, values, goals, and long-term compatibility.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-5.1",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
        return response.choices[0].message.content;
    } catch (error) {
        console.error(error)
    }
}

export async function generateIntroEmail({ customer, candidate, score, reasons }) {
    const prompt = `
    Write a short personalized matchmaking introduction email.

    The email is being sent to:
    ${customer.firstName} ${customer.lastName}

    Suggested match basic profile:
    Name: ${candidate.firstName} ${candidate.lastName}
    City: ${candidate.city}, ${candidate.country}
    Height: ${candidate.heightCm} cm
    Education: ${candidate.degree} from ${candidate.college}
    Profession: ${candidate.designation} at ${candidate.company}
    Income: ${candidate.incomeLpa} LPA
    Marital status: ${candidate.maritalStatus}
    Languages known: ${candidate.languagesKnown?.join(", ")}
    Diet: ${candidate.diet}
    Relationship goal: ${candidate.relationshipGoal}
    Marriage timeline: ${candidate.marriageTimeline}
    Wants kids: ${candidate.wantKids}
    Open to relocate: ${candidate.openToRelocate}
    Open to pets: ${candidate.openToPets}
    Personality: ${candidate.personalityType}
    Family preference: ${candidate.familyPreference}
    Values: ${candidate.values?.join(", ")}

    Compatibility score: ${score}/100

    Reasons: ${reasons.join(", ")}

    Rules:
    - Keep it under 180 words.
    - Warm and premium tone.
    - Include the candidate's basic profile info naturally.
    - Do not overpromise.
    - Do not mention caste/religion directly.
    - Do not use markdown.
    - End by asking if they would like to be introduced.
    - Return only the email body, no subject.`;
    
    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-5.1",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
        return response.choices[0].message.content;
    } catch (error) {
        console.error(error)
    }
}
