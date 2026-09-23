/* ---------- api/send-email.js (Vercel Serverless Function) ---------- */
// Place this file in the `/api` directory of your Vercel project repository.
// In Vercel Project Settings -> Environment Variables, add: RESEND_API_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, type, budget, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Suvop <onboarding@resend.dev>", // Or your verified domain email
        to: ["shuvrod564@gmail.com"], // Must be your registered Resend account email when using onboarding domain
        subject: `New Lead: ${name} (${type || 'General Inquiry'})`,
        reply_to: email,
        html: `
          <h2>New Lead Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${type}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Message:</strong></p>
          <p>${message ? message.replace(/\n/g, '<br>') : 'N/A'}</p>
        `
      })
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      return res.status(resendRes.status).json({ error: data.message || "Failed to send email" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}