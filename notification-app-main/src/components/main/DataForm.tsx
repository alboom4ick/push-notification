import { useState } from "react";
import { Search } from "lucide-react";
import { Container } from "../shared/Container.tsx";
import { motion } from "framer-motion";
import { createNotification, getStatus } from "../../api/axiosInstance.ts";
import { useNavigate } from "react-router-dom";

export const DataForm = () => {
    const [query, setQuery] = useState<number>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(Number(value));
    };

    const handleSubmit = async () => {
        if (!query) return;
        setLoading(true);
        const currentTime = new Date().toISOString();

        try {
            const created = await createNotification(Number(query), currentTime);
            console.log("created", created);
            const notificationId = created;
            if(notificationId!==null){
                const interval = setInterval(async () => {
                    try {
                        const status = await getStatus(notificationId);
                        console.log("statusData", status);
                        if (status === "completed") {
                            clearInterval(interval);
                            setLoading(false);
                            navigate(`/notification-get?id=${notificationId}`);
                        }
                        if(status === "error"){
                            setLoading(false);

                        }
                    } catch (err) {
                        console.log("Ошибка при проверке статуса:", err);
                    }
                }, 1000);
            }

        } catch (err) {
            console.log("Ошибка при создании уведомления:", err);
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="relative mx-auto w-full my-10">
                <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    type="text"
                    placeholder="Введите client_code..."
                    value={query || ""}
                    onChange={handleSearch}
                    className="w-full py-3 bg-white border-2 rounded-xl pl-4 pr-10 border-gray-200 focus:border-gray-400 focus:outline-none shadow-sm"
                />
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                >
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </motion.div>
            </div>
            <button
                onClick={handleSubmit}
                className="bg-green-500 w-full flex justify-center items-center text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                disabled={loading}
            >
                {loading ? "Создаём уведомление..." : "Продолжить"}
            </button>
        </Container>
    );
};
