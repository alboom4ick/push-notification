import {UserIcon} from "lucide-react";

interface CardItemProps {
    name: string;
}

export const CardItem = ({name}:CardItemProps) => {
    return (
        <div className={"bg-white border flex gap-5 border-gray-300 rounded-lg p-3"}>
            <UserIcon className={"opacity-80"} />
            <p className={"text-bold"}>{name}</p>
        </div>
    )

}