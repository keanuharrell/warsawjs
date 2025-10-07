import { NextResponse } from "next/server";
import { emailService } from "@warsawjs/core";

// POST /api/demo/email - Send recap email
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send email using SES
    await emailService.send({
      to: email,
      subject: "WarsawJS × SST - Presentation Recap",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #2563eb; }
              .section { margin: 20px 0; }
              .link { color: #2563eb; text-decoration: none; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 Thanks for attending WarsawJS!</h1>

              <p>Hi there!</p>

              <p>Thanks for joining my presentation on <strong>SST (Serverless Stack)</strong>. Here's a quick recap of what we covered:</p>

              <div class="section">
                <h2>📚 Key Topics</h2>
                <ul>
                  <li><strong>Modern Infrastructure as Code</strong> - How SST simplifies serverless development</li>
                  <li><strong>Real-time Features</strong> - Building live chat and voting with MQTT + IoT Core</li>
                  <li><strong>Full-Stack TypeScript</strong> - End-to-end type safety with Next.js + Lambda</li>
                  <li><strong>Authentication</strong> - Secure auth flows with AWS Cognito</li>
                  <li><strong>Email Integration</strong> - Transactional emails with SES</li>
                </ul>
              </div>

              <div class="section">
                <h2>🔗 Useful Resources</h2>
                <ul>
                  <li><a href="https://sst.dev" class="link">SST Documentation</a> - Official docs and guides</li>
                  <li><a href="https://github.com/sst/sst" class="link">SST GitHub</a> - Source code and examples</li>
                  <li><a href="https://sst.dev/discord" class="link">SST Discord</a> - Community support</li>
                  <li><a href="https://github.com/keanuharrell" class="link">Demo Code (Coming Soon)</a> - GitHub repository with today's demo</li>
                </ul>
              </div>

              <div class="section">
                <h2>🚀 Next Steps</h2>
                <p>Ready to build your own serverless apps with SST? Here's what I recommend:</p>
                <ol>
                  <li>Install SST: <code>npm install -g sst</code></li>
                  <li>Create a new project: <code>sst create</code></li>
                  <li>Check out the <a href="https://sst.dev/examples" class="link">examples gallery</a></li>
                  <li>Join the Discord community for help!</li>
                </ol>
              </div>

              <div class="footer">
                <p>Thanks again for being part of WarsawJS! 🇵🇱</p>
                <p>Keanu Harrell</p>
                <p style="font-size: 12px; color: #999;">
                  This email was sent because you requested a recap from the WarsawJS × SST presentation.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
WarsawJS × SST - Presentation Recap

Hi there!

Thanks for joining my presentation on SST (Serverless Stack). Here's a quick recap:

KEY TOPICS:
- Modern Infrastructure as Code - How SST simplifies serverless development
- Real-time Features - Building live chat and voting with MQTT + IoT Core
- Full-Stack TypeScript - End-to-end type safety with Next.js + Lambda
- Authentication - Secure auth flows with AWS Cognito
- Email Integration - Transactional emails with SES

USEFUL RESOURCES:
- SST Documentation: https://sst.dev
- SST GitHub: https://github.com/sst/sst
- SST Discord: https://sst.dev/discord
- Demo Code (Coming Soon): https://github.com/keanuharrell

NEXT STEPS:
1. Install SST: npm install -g sst
2. Create a new project: sst create
3. Check out the examples: https://sst.dev/examples
4. Join the Discord community!

Thanks again for being part of WarsawJS! 🇵🇱

Keanu Harrell
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
