import "dotenv/config";
import { generateMatchExplanation, generateIntroEmail } from "./src/services/ai.service.js";

const customer = {
  firstName: "Rohan",
  lastName: "Mehra",
  gender: "MALE",
  city: "Bangalore",
  designation: "Product Manager",
  company: "Razorpay",
  degree: "B.Tech",
  college: "BITS Pilani",
  relationshipGoal: "MARRIAGE",
  marriageTimeline: "WITHIN_1_YEAR",
  wantKids: "YES",
  openToRelocate: "MAYBE",
  diet: "VEGETARIAN",
  personalityType: "AMBIVERT",
  familyPreference: "NUCLEAR",
  values: ["Ambition", "Family", "Emotional Maturity"],
};

const candidate = {
  firstName: "Aanya",
  lastName: "Sharma",
  gender: "FEMALE",
  city: "Bangalore",
  designation: "UX Designer",
  company: "Swiggy",
  degree: "B.Des",
  college: "NID",
  relationshipGoal: "MARRIAGE",
  marriageTimeline: "WITHIN_1_YEAR",
  wantKids: "YES",
  openToRelocate: "MAYBE",
  diet: "VEGETARIAN",
  personalityType: "AMBIVERT",
  familyPreference: "NUCLEAR",
  values: ["Family", "Creativity", "Emotional Maturity"],
};

const score = 88;
const reasons = [
  "Both want kids",
  "Same city",
  "Same diet preference",
  "Shared values: Family, Emotional Maturity",
  "Marriage timeline is aligned",
];

async function testAI() {
  const explanation = await generateMatchExplanation({
    customer,
    candidate,
    score,
    reasons,
  });

  console.log("\nAI Explanation:\n");
  console.log(explanation);

  const introEmail = await generateIntroEmail({
    customer,
    candidate,
    score,
    reasons,
  });

  console.log("\nIntro Email:\n");
  console.log(introEmail);
}

testAI().catch(console.error);