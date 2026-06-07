import { prisma } from "../config/client.js";

export async function findAllCustomers(matchmakerId) {
  const whereClause = matchmakerId ? { assignedMatchmakerId: matchmakerId } : {};

  return prisma.customer.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      gender: true,
      dateOfBirth: true,
      city: true,
      country: true,
      maritalStatus: true,
      statusTag: true,
      profileVerified: true,
      company: true,
      designation: true,
      photos: true,
    },
  });
}

export async function findCustomerById(id) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      preferences: true,
      notes: {
        orderBy: {
          createdAt: "desc",
        },
      },
      matchesForThisCustomer: {
        include: {
          suggestedCustomer: true,
        },
        orderBy: {
          score: "desc",
        },
      },
    },
  });
}