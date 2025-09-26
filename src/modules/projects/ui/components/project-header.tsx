import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client"
import { DropdownMenuSubContent } from "@radix-ui/react-dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";




export const ProjectHeader = ({ projectId }: { projectId: string }) => {
    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));
    const { setTheme, theme } = useTheme();


    return (
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button value="ghost" size="sm" className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!">
                        <Image src="/logo.svg" alt="Logo" width={18} height={18} />
                        <span className="text-sm font-medium">{project.name}</span>
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <ChevronLeftIcon />
                            <span>Go to Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-2">
                            <SunMoonIcon className="size-4 text-muted-foreground" />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-white text-black shadow-md z-50 p-2 rounded">
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="light">
                                        <span>Light</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        <span>Dark</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                        <span>System</span>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}