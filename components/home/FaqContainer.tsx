import { Plus, X } from "lucide-react";
import { useState } from "react";

export interface FaqContainerProps {
    number: string,
    title: string,
    children?: React.ReactNode
}

const FaqContainer = ({
    number,
    title,
    children
}: FaqContainerProps) => {

    const [open, setOpen] = useState<boolean>(false);

    return (<div onClick={() => setOpen(!open)} className="mt-4 cursor-pointer flex items-start justify-between rounded-[10px] p-6 bg-neutral-900 border-2 border-[#323237]">
        <div className="flex items-start gap-x-4">
            <span className="text-2xl font-bold text-[#A1A1AA]">{number}</span>
            <div>
                <span className="text-2xl font-semibold text-[#A1A1AA]">{title}</span>
                <div hidden={!open} className="mt-4">
                    {children}
                </div>
            </div>
        </div>
        <div hidden={!children} onClick={() => setOpen(!open)} className="cursor-pointer text-2xl pt-1">
            {
                open ? <X strokeWidth={5} /> : <Plus strokeWidth={5} />
            }
        </div>
    </div>)
}

export default FaqContainer;