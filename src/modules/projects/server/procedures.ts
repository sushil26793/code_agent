import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";


export const projectRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: { id: input.id, userId: ctx.auth.userId },
                include: {
                    messages: true
                }
            })
            if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
            return project;
        }),
    getMany: protectedProcedure.query(async ({ ctx }) => {
        const projects = await prisma.project.findMany({
            where: { userId: ctx.auth.userId },
            orderBy: { createdAt: "desc" },
            include: {
                messages: true
            }
        })
        return projects;
    }),
    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message cannot be empty" }).max(1000, { message: "Value is too long." }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                await consumeCredits();

            } catch (error) {
                if (error instanceof Error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "something went wrong"
                    })
                } else {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "You have run out of credits."
                    })
                }
            }
            const createdProject = await prisma.project.create({
                data: {
                    userId: ctx.auth.userId,
                    name: generateSlug(2, { format: "kebab" }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT"
                        }
                    }
                },

            });

            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: createdProject.id
                }
            })
            return createdProject;

        })
});