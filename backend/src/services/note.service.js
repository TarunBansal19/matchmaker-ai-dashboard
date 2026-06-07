import { prisma } from "../config/client.js";

export async function findNotesByCustomer(customerId) {
  return prisma.matchmakerNote.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addNote({ customerId, matchmakerId, note }) {
  return prisma.matchmakerNote.create({
    data: {
      customerId,
      matchmakerId,
      note,
    },
  });
}