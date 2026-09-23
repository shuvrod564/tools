/* ---------- netlify/functions/send-email.js ---------- */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
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

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>", // Or your verified custom domain sender
        to: ["shuvrod564@gmail.com"], // Must be your registered Resend email address during testing
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
      return {
        statusCode: resendRes.status,
        body: JSON.stringify({ error: data.message || "Resend API call failed" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};