import "dotenv/config";
import { sendMatchEmail } from "./src/services/email.service.js";

async function testEmail() {
  const result = await sendMatchEmail({
    to: "test.matchmaker.com@gmail.com",
    subject: "Test Match Email from TDC MVP",
    body: `
Hi Rohan,

We found a thoughtful match for you.

Aanya seems aligned with your values, lifestyle, and relationship goals.

Would you like us to make an introduction?

Warmly,
The Date Crew
`,
  });

  console.log("Email sent:", result);
}

testEmail().catch(console.error);