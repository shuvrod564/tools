/* ---------- netlify/functions/send-email.js ---------- */
exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server email configuration error (missing API key)." })
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { name, email, type, budget, message } = payload;

    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and Email are required." })
      };
    }

    // Basic sanitization helper for HTML template
    const esc = (str) =>
      str ? String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
      }[m])) : "";

    const formattedMessage = message ? esc(message).replace(/\n/g, "<br>") : "N/A";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>", // Replace with your verified custom domain in production
        to: ["shuvrod564@gmail.com"],         // Must match your registered Resend account email during testing
        reply_to: email,
        subject: `Suvop Site Lead: ${esc(name)} (${esc(type) || "General Inquiry"})`,
        html: `
          <h2>New Lead Form Submission</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Project Type:</strong> ${esc(type) || "N/A"}</p>
          <p><strong>Budget:</strong> ${esc(budget) || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${formattedMessage}</p>
        `
      })
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API rejection:", data);
      return {
        statusCode: resendRes.status,
        body: JSON.stringify({ error: data.message || "Failed to send email." })
      };
    }

    console.log("Email sent successfully! ID:", data.id);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id })
    };
  } catch (error) {
    console.error("Netlify function runtime error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};