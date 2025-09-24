import { inngest } from "./client";
import { gemini, createAgent, createTool, createNetwork, type Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getLastTextMessageContent, getSandbox } from "./utills";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [key: string]: string };

}
export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-sushil-01")
      return sandbox.sandboxId;
    })
    await step.sleep("wait-a-moment", "5s");

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent.",
      system: PROMPT,
      model: gemini({ model: "gemini-2.0-flash" }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to commands",
          parameters: z.object({
            command: z.string(),
          }),

          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: '', stderr: '' };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout(data) {
                    buffers.stdout += data;

                  },
                  onStderr(data) {
                    buffers.stderr += data;
                  }
                });
                return { stdout: buffers.stdout, stderr: buffers.stderr };
              } catch (e) {
                console.error(`Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`);
                return { error: `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}` };
              }
            })
          }
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox.",
          parameters: z.object({
            files: z.array(z.object({
              path: z.string(),
              content: z.string()
            }))
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                console.error("Error creating or updating files:", error);
                return "Error: " + error;

              }
            })
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox.",
          parameters: z.object({
            files: z.array(z.string())
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = []
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });

                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error: " + error;
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastMessageText = getLastTextMessageContent(result);
          if (lastMessageText && network) {
            if (lastMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastMessageText;
            }
          }
          return result;
        }
      }
    });
    const network = createNetwork<AgentState>({
      name: 'coding-agent-network',
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) return
        return codeAgent
      }
    })
    const result = await network.run(event.data.value);
    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Sorry, I encountered an error and couldn't complete the task.",
            role: "ASSISTANT",
            type: "ERROR",
          }
        })
      }

      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl,
              title: "Fragment",
              files: result.state.data.files
            }
          }
        }
      })
    })
    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);




