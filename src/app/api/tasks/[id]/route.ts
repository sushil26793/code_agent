import { NextRequest, NextResponse } from "next/server";
import { success, z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateTaskSchema = z.object({
  completed: z.boolean(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const result = updateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }
    const updated = await prisma.task.update({
      where: { id },
      data: { completed: result.data.completed },
    });
    return NextResponse.json({ task: updated });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.log(err);
    if (err.code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
