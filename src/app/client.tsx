"use client";

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export const Client = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.createAi.queryOptions({ text: "hello from server" }))

    return (
        <div>{JSON.stringify(data)}</div>
    )
}