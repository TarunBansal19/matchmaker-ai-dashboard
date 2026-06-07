import { prisma } from "./../config/client.js";

export async function getMe(req, res) {
  try {
    const { email } = req.body;

    const matchmaker = await prisma.matchmaker.findUnique({
      where: { email },
    });

    if (!matchmaker) {
      return res.status(404).json({
        success: false,
        message: "Matchmaker not found",
      });
    }

    res.json({
      success: true,
      data: matchmaker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch matchmaker",
    });
  }
}