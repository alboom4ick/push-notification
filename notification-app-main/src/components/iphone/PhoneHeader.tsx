import {ChartNoAxesColumnIncreasing, WifiIcon} from "lucide-react";

export function PhoneHeader() {
    return (
        <div className="flex text-sm justify-between">
            <div>
                Beeline
            </div>
            <div className="flex gap-2">
                <ChartNoAxesColumnIncreasing width={16} height={16} />
                <WifiIcon width={16} height={16} />
            </div>
        </div>
    )
}