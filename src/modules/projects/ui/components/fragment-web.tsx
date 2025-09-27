import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";



export const FragmentWeb = ({ data }: { data: Fragment }) => {
    const [fragmentKey, setFragmentKey] = useState(0);
    const [copied, setCopied] = useState(false);

    const onRefresh = () => {
        setFragmentKey((prev) => prev + 1)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Hint text="Refresh" side="bottom" align="start">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRefresh}
                    >
                        <RefreshCcwIcon />
                    </Button>
                </Hint>
                <Hint text="Click to copy" side="bottom">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!data.sandboxUrl || copied}
                        className="flex-1 justify-start text-start font-normal"
                        onClick={handleCopy}
                    >
                        <span className="truncate">{data.sandboxUrl}</span>
                    </Button>
                </Hint>
                <Hint text="Open in new tab" side="bottom" align="start">
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        disabled={!data.sandboxUrl}
                        onClick={() => window.open(data.sandboxUrl, "_blank")}
                    >
                        <ExternalLinkIcon />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmentKey}
                className="h-full w-full"
                sandbox="allow-forms allow-scripts allow-same-origin"
                loading="lazy"
                src={data.sandboxUrl}
            />
        </div>
    )
}