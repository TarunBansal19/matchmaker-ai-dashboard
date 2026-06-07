import { prisma } from "../config/client.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { matchmakerId } = req.query;

    if (!matchmakerId) {
      return res.status(400).json({ message: "matchmakerId is required" });
    }

    // Total Customers
    const totalCustomers = await prisma.customer.count({
      where: { assignedMatchmakerId: matchmakerId },
    });

    // Pending Profiles (Status NEW)
    const pendingProfiles = await prisma.customer.count({
      where: { assignedMatchmakerId: matchmakerId, statusTag: "NEW" },
    });

    // Verified Profiles (Status VERIFIED)
    const verifiedProfiles = await prisma.customer.count({
      where: { assignedMatchmakerId: matchmakerId, statusTag: "VERIFIED" },
    });

    // Matches Sent
    const customers = await prisma.customer.findMany({
      where: { assignedMatchmakerId: matchmakerId },
      select: { id: true },
    });
    
    const customerIds = customers.map(c => c.id);

    const matchesSent = await prisma.matchSuggestion.count({
      where: {
        customerId: { in: customerIds },
        status: "SENT",
      },
    });

    // Matches Chart Data: Total generated matches by date for the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const matches = await prisma.matchSuggestion.findMany({
      where: {
        customerId: { in: customerIds },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date (MM/DD)
    const chartDataMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      chartDataMap[key] = 0;
    }

    matches.forEach(m => {
      const d = new Date(m.createdAt);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (chartDataMap[key] !== undefined) {
        chartDataMap[key]++;
      }
    });

    const chartData = Object.keys(chartDataMap).map(key => ({
      name: key,
      matches: chartDataMap[key],
    }));

    res.json({
      success: true,
      data: {
        totalCustomers,
        pendingProfiles,
        verifiedProfiles,
        matchesSent,
        chartData,
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};
