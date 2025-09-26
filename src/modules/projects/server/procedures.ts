import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import {TRPCError} from "@trpc/server";


export const projectRouter = createTRPCRouter({
     getOne: baseProcedure
     .input(z.object({
        id: z.string()
     }))
     .query(async ({ input }) => {
        const project = await prisma.project.findUnique({
            where: { id: input.id },
            include: {
                messages: true
            }
        })
        if(!project) throw new TRPCError({ code:"NOT_FOUND", message: "Project not found" });
        return project;
    }),
    getMany: baseProcedure.query(async () => {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                messages: true
            }
        })
        return projects;
    }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message cannot be empty" }).max(1000,{message:"Value is too long."}),
            })
        )
        .mutation(async ({ input }) => {
            const createdProject = await prisma.project.create({
                data: {
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