import { prisma } from "../config/client.js";
import { matchCustomer } from "../utils/matchingEngine.js";
import { generateMatchExplanation, generateIntroEmail } from "./ai.service.js";
import { sendMatchEmail } from "./email.service.js";

export async function getAllMatchesForMatchmaker(matchmakerId) {
  return prisma.matchSuggestion.findMany({
    where: {
      customer: {
        assignedMatchmakerId: matchmakerId,
      },
    },
    include: {
      customer: true,
      suggestedCustomer: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function generateAndSaveMatches(customerId) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      preferences: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const candidates = await prisma.customer.findMany({
    where: {
      id: {
        not: customerId,
      },
      gender: {
        not: customer.gender,
      },
    },
    include: {
      preferences: true,
    },
  });

  const matches = matchCustomer(customer, candidates).slice(0, 10);

  await prisma.matchSuggestion.deleteMany({
    where: {
      customerId,
      status: "SUGGESTED",
    },
  });

  const savedMatches = [];

  for (const match of matches) {
    const aiExplanation = await generateMatchExplanation({
      customer,
      candidate: match.candidate,
      score: match.score,
      reasons: match.reasons,
    });

    const introEmail = await generateIntroEmail({
      customer,
      candidate: match.candidate,
      score: match.score,
      reasons: match.reasons,
    });

    const saved = await prisma.matchSuggestion.create({
      data: {
        customerId,
        suggestedCustomerId: match.suggestedCustomerId,
        score: match.score,
        label: match.label,
        reasons: match.reasons,
        aiExplanation,
        introEmail,
      },
      include: {
        suggestedCustomer: true,
      },
    });

    savedMatches.push(saved);
  }

  await prisma.customer.update({
    where: { id: customerId },
    data: { statusTag: "MATCHES_READY" },
  });

  return savedMatches;
}

export async function markMatchAsSent(matchId) {
  const match = await prisma.matchSuggestion.findUnique({
    where: { id: matchId },
    include: {
      customer: true,
      suggestedCustomer: true,
    },
  });

  if (!match) {
    throw new Error("Match not found");
  }

  if (!match.introEmail) {
    throw new Error("Intro email not generated yet");
  }

  await sendMatchEmail({
    to: match.customer.email,
    subject: `A thoughtful introduction from The Date Crew`,
    body: match.introEmail,
  });

  const updatedMatch = await prisma.matchSuggestion.update({
    where: { id: matchId },
    data: {
      status: "SENT",
      sentAt: new Date(),
    },
    include: {
      customer: true,
      suggestedCustomer: true,
    },
  });

  await prisma.customer.update({
    where: { id: match.customerId },
    data: { statusTag: "MATCH_SENT" },
  });

  return updatedMatch;
}