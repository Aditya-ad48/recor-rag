import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { message } = await req.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dummy Markdown Response mimicking the screenshot content
    const responseText = `
Here is a design based on your request. I have included two options:

1.  **Using the \`use-scramble\` library** (Easiest, as requested).
2.  **A Custom Hook version** (No external dependencies).

### Option 1: Using \`use-scramble\`

First, install the library:

\`\`\`bash
npm install use-scramble
\`\`\`

Then create your component. This example creates a bold, modern title that scrambles on hover or load.

> **Note:** The scramble effect adds a nice "hacker" aesthetic to your UI.
  `;

    return NextResponse.json({ text: responseText });
}
