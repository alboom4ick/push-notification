import {Skeleton} from "primereact/skeleton";

export function CardSkeleton() {
    return (
        <>
            {Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton
                    key={idx}
                    className="w-full h-[100px] rounded-lg block"
                />
            ))}
        </>
    );
}
