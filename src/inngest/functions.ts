import { inngest } from "./client";
import {gemini,createAgent } from "@inngest/agent-kit"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5s");

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert MERN stack (next js) developer . You write readable , maintainable code. You write simple Next.js , React.js snippets.",
      model: gemini({ model: "gemini-2.0-flash"}),
    });
    const { output } = await codeAgent.run(
      `Write the following code snippet: ${event.data.value}`,
);
    return { output };
  },
);