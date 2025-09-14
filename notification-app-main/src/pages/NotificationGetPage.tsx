import { useSearchParams } from "react-router-dom";
import Wallpaper from "../assets/Wallpaper.png";
import { PhoneHeader } from "../components/iphone/PhoneHeader.tsx";
import { PhoneTime } from "../components/iphone/PhoneTime.tsx";
import { PhoneNotifications } from "../components/iphone/PhoneNotifications.tsx";
import { useEffect, useState } from "react";
import {getResult} from "../api/axiosInstance.ts";

export function NotificationGetPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [notificationData, setNotificationData] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchNotification = async () => {
            try {
                const data = await getResult(Number(id));
                setNotificationData(data.message);
            } catch (err) {
                console.log("Error fetching notification:", err);
            }
        };

        fetchNotification();
    }, [id]);

    return (
        <div
            style={{
                backgroundImage: `url(${Wallpaper})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100dvh"
            }}
            className="px-4 text-white py-3 flex flex-col gap-4"
        >
            <PhoneHeader />
            <PhoneTime />
            <PhoneNotifications message={notificationData} />
        </div>
    );
}
