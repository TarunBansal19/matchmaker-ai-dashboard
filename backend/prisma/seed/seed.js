import { fakerEN_IN } from "@faker-js/faker";
import {prisma} from "../../src/config/client.js";

async function main() {

    // Seeding 100 male , 100 female and 25 other customers with random data

    for (let i = 0; i < 100; i++) {
        await prisma.customer.create({
            data: {
                firstName: fakerEN_IN.person.firstName("male"),
                lastName: fakerEN_IN.person.lastName(),
                phone: fakerEN_IN.phone.number(),
                email: fakerEN_IN.internet.email(),
                caste: fakerEN_IN.helpers.arrayElement(["BRAHMIN", "KSHATRIYA", "VAISHYA", "SHUDRA", "OTHER"]),
                religion: fakerEN_IN.helpers.arrayElement(["HINDU", "MUSLIM", "CHRISTIAN", "SIKH", "OTHER"]),
                city: fakerEN_IN.location.city(),
                college: fakerEN_IN.helpers.arrayElement(["IIT", "NIT", "IIM", "AIIMS", "NLU", "DU", "JIIT", "OTHER"]),
                designation: fakerEN_IN.person.jobTitle(),
                company: fakerEN_IN.company.name(),
                country: "India",
                dateOfBirth: fakerEN_IN.date.birthdate({ min: 21, max: 45, mode: "age" }),
                degree: fakerEN_IN.helpers.arrayElement(["HIGH_SCHOOL", "BACHELORS", "MASTERS", "PHD", "OTHER"]),
                diet: fakerEN_IN.helpers.arrayElement(["VEGETARIAN", "NON_VEGETARIAN", "VEGAN", "OTHER"]),
                drinking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                familyPreference: fakerEN_IN.helpers.arrayElement(["JOINT", "NUCLEAR", "NO_PREFERENCE"]),
                gender: "MALE",
                heightCm: fakerEN_IN.number.int({ min: 140, max: 200 }),
                incomeLpa: fakerEN_IN.number.int({ min: 5, max: 99 }),
                languagesKnown: fakerEN_IN.helpers.arrayElements(["ENGLISH", "HINDI", "MARATHI", "BENGALI", "TAMIL", "TELUGU", "GUJARATI", "OTHER"],fakerEN_IN.number.int({ min: 1, max: 4 })),
                maritalStatus: fakerEN_IN.helpers.arrayElement(["SINGLE", "SEPARATED", "DIVORCED", "WIDOWED"]),
                marriageTimeline: fakerEN_IN.helpers.arrayElement(["WITHIN_1_YEAR", "1_2_YEARS", "2_3_YEARS", "3_PLUS_YEARS"]),
                openToRelocate: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                openToPets: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                wantKids: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                siblingsCount: fakerEN_IN.number.int({ min: 0, max: 5 }),
                smoking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                relationshipGoal: fakerEN_IN.helpers.arrayElement(["MARRIAGE", "LONG_TERM_RELATIONSHIP", "SHORT_TERM_RELATIONSHIP"]),
                personalityType: fakerEN_IN.helpers.arrayElement(["INTROVERT", "EXTROVERT", "AMBIVERT"]),
                values: fakerEN_IN.helpers.arrayElements(["FAMILY_ORIENTED","GOD_FEARING","CAREER_DRIVEN","INDEPENDENT","ADVENTUROUS","SPIRITUAL","HONEST","LOYAL","AMBITIOUS","COMPASSIONATE","HUMOROUS","SIMPLE_LIVING","SOCIAL","INTROVERTED","TRADITIONAL","MODERN","PATIENT","EMPATHETIC","HOMELY","HEALTH_CONSCIOUS"],fakerEN_IN.number.int({ min: 2, max: 6 })),
                photos: Array.from({ length: fakerEN_IN.number.int({ min: 1, max: 5 }) }, () => fakerEN_IN.image.avatar()),
                statusTag: fakerEN_IN.helpers.arrayElement(["NEW" , "IN_REVIEW" , "VERIFIED" , "MATCHES_READY" , "MATCH_SENT" , "ON_HOLD"]),
                profileVerified: fakerEN_IN.datatype.boolean(),
            }
        });
    }
    for (let i = 0; i < 100; i++) {
        await prisma.customer.create({
            data: {
                firstName: fakerEN_IN.person.firstName("female"),
                lastName: fakerEN_IN.person.lastName(),
                phone: fakerEN_IN.phone.number(),
                email: fakerEN_IN.internet.email(),
                caste: fakerEN_IN.helpers.arrayElement(["BRAHMIN", "KSHATRIYA", "VAISHYA", "SHUDRA", "OTHER"]),
                religion: fakerEN_IN.helpers.arrayElement(["HINDU", "MUSLIM", "CHRISTIAN", "SIKH", "OTHER"]),
                city: fakerEN_IN.location.city(),
                college: fakerEN_IN.helpers.arrayElement(["IIT", "NIT", "IIM", "AIIMS", "NLU", "DU", "JIIT", "OTHER"]),
                designation: fakerEN_IN.person.jobTitle(),
                company: fakerEN_IN.company.name(),
                country: "India",
                dateOfBirth: fakerEN_IN.date.birthdate({ min: 21, max: 45, mode: "age" }),
                degree: fakerEN_IN.helpers.arrayElement(["HIGH_SCHOOL", "BACHELORS", "MASTERS", "PHD", "OTHER"]),
                diet: fakerEN_IN.helpers.arrayElement(["VEGETARIAN", "NON_VEGETARIAN", "VEGAN", "OTHER"]),
                drinking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                familyPreference: fakerEN_IN.helpers.arrayElement(["JOINT", "NUCLEAR", "NO_PREFERENCE"]),
                gender: "FEMALE",
                heightCm: fakerEN_IN.number.int({ min: 140, max: 200 }),
                incomeLpa: fakerEN_IN.number.int({ min: 5, max: 99 }),
                languagesKnown: fakerEN_IN.helpers.arrayElements(["ENGLISH", "HINDI", "MARATHI", "BENGALI", "TAMIL", "TELUGU", "GUJARATI", "OTHER"],fakerEN_IN.number.int({ min: 1, max: 4 })),
                maritalStatus: fakerEN_IN.helpers.arrayElement(["SINGLE", "SEPARATED", "DIVORCED", "WIDOWED"]),
                marriageTimeline: fakerEN_IN.helpers.arrayElement(["WITHIN_1_YEAR", "1_2_YEARS", "2_3_YEARS", "3_PLUS_YEARS"]),
                openToRelocate: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                openToPets: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                wantKids: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                siblingsCount: fakerEN_IN.number.int({ min: 0, max: 5 }),
                smoking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                relationshipGoal: fakerEN_IN.helpers.arrayElement(["MARRIAGE", "LONG_TERM_RELATIONSHIP", "SHORT_TERM_RELATIONSHIP"]),
                personalityType: fakerEN_IN.helpers.arrayElement(["INTROVERT", "EXTROVERT", "AMBIVERT"]),
                values: fakerEN_IN.helpers.arrayElements(["FAMILY_ORIENTED","GOD_FEARING","CAREER_DRIVEN","INDEPENDENT","ADVENTUROUS","SPIRITUAL","HONEST","LOYAL","AMBITIOUS","COMPASSIONATE","HUMOROUS","SIMPLE_LIVING","SOCIAL","INTROVERTED","TRADITIONAL","MODERN","PATIENT","EMPATHETIC","HOMELY","HEALTH_CONSCIOUS"],fakerEN_IN.number.int({ min: 2, max: 6 })),
                photos: Array.from({ length: fakerEN_IN.number.int({ min: 1, max: 5 }) }, () => fakerEN_IN.image.avatar()),
                statusTag: fakerEN_IN.helpers.arrayElement(["NEW" , "IN_REVIEW" , "VERIFIED" , "MATCHES_READY" , "MATCH_SENT" , "ON_HOLD"]),
                profileVerified: fakerEN_IN.datatype.boolean(),
            }
        });
    }

    for (let i = 0; i < 25; i++) {
        await prisma.customer.create({
            data: {
                firstName: fakerEN_IN.person.firstName(),
                lastName: fakerEN_IN.person.lastName(),
                phone: fakerEN_IN.phone.number(),
                email: fakerEN_IN.internet.email(),
                caste: fakerEN_IN.helpers.arrayElement(["BRAHMIN", "KSHATRIYA", "VAISHYA", "SHUDRA", "OTHER"]),
                religion: fakerEN_IN.helpers.arrayElement(["HINDU", "MUSLIM", "CHRISTIAN", "SIKH", "OTHER"]),
                city: fakerEN_IN.location.city(),
                college: fakerEN_IN.helpers.arrayElement(["IIT", "NIT", "IIM", "AIIMS", "NLU", "DU", "JIIT", "OTHER"]),
                designation: fakerEN_IN.person.jobTitle(),
                company: fakerEN_IN.company.name(),
                country: "India",
                dateOfBirth: fakerEN_IN.date.birthdate({ min: 21, max: 45, mode: "age" }),
                degree: fakerEN_IN.helpers.arrayElement(["HIGH_SCHOOL", "BACHELORS", "MASTERS", "PHD", "OTHER"]),
                diet: fakerEN_IN.helpers.arrayElement(["VEGETARIAN", "NON_VEGETARIAN", "VEGAN", "OTHER"]),
                drinking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                familyPreference: fakerEN_IN.helpers.arrayElement(["JOINT", "NUCLEAR", "NO_PREFERENCE"]),
                gender: "OTHER",
                heightCm: fakerEN_IN.number.int({ min: 140, max: 200 }),
                incomeLpa: fakerEN_IN.number.int({ min: 5, max: 99 }),
                languagesKnown: fakerEN_IN.helpers.arrayElements(["ENGLISH", "HINDI", "MARATHI", "BENGALI", "TAMIL", "TELUGU", "GUJARATI", "OTHER"],fakerEN_IN.number.int({ min: 1, max: 4 })),
                maritalStatus: fakerEN_IN.helpers.arrayElement(["SINGLE", "SEPARATED", "DIVORCED", "WIDOWED"]),
                marriageTimeline: fakerEN_IN.helpers.arrayElement(["WITHIN_1_YEAR", "1_2_YEARS", "2_3_YEARS", "3_PLUS_YEARS"]),
                openToRelocate: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                openToPets: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                wantKids: fakerEN_IN.helpers.arrayElement(["YES" , "NO" , "MAYBE"]),
                siblingsCount: fakerEN_IN.number.int({ min: 0, max: 5 }),
                smoking: fakerEN_IN.helpers.arrayElement(["YES", "NO", "OCCASIONALLY"]),
                relationshipGoal: fakerEN_IN.helpers.arrayElement(["MARRIAGE", "LONG_TERM_RELATIONSHIP", "SHORT_TERM_RELATIONSHIP"]),
                personalityType: fakerEN_IN.helpers.arrayElement(["INTROVERT", "EXTROVERT", "AMBIVERT"]),
                values: fakerEN_IN.helpers.arrayElements(["FAMILY_ORIENTED","GOD_FEARING","CAREER_DRIVEN","INDEPENDENT","ADVENTUROUS","SPIRITUAL","HONEST","LOYAL","AMBITIOUS","COMPASSIONATE","HUMOROUS","SIMPLE_LIVING","SOCIAL","INTROVERTED","TRADITIONAL","MODERN","PATIENT","EMPATHETIC","HOMELY","HEALTH_CONSCIOUS"],fakerEN_IN.number.int({ min: 2, max: 6 })),
                photos: Array.from({ length: fakerEN_IN.number.int({ min: 1, max: 5 }) }, () => fakerEN_IN.image.avatar()),
                statusTag: fakerEN_IN.helpers.arrayElement(["NEW" , "IN_REVIEW" , "VERIFIED" , "MATCHES_READY" , "MATCH_SENT" , "ON_HOLD"]),
                profileVerified: fakerEN_IN.datatype.boolean(),
            }
        });
    }
}

// Execute the main function and handle any errors
main().catch((e) => {
    console.error(e);
}).finally(async() => {
    await prisma.$disconnect();
})