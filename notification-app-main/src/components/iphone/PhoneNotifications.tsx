import { AnimatePresence, motion } from "framer-motion";
import Logo from "../../assets/app-icon.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NotificationProps {
    message: string | null;
}

export function PhoneNotifications({ message }: NotificationProps) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (expanded) {
            navigate('/apply');
        }
        setExpanded(!expanded);
    };

    function formatMessage(raw: string | null) {
        if (!raw) return { title: "", body: "" };

        // Убираем лишние {message= и }
        const cleaned = raw.replace(/\{message=/g, "").replace(/\}$/g, "").trim();

        // Ищем заголовок в ** **
        const titleMatch = cleaned.match(/\*\*(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1].trim() : "";

        // Убираем заголовок из основного текста
        const body = cleaned.replace(titleMatch?.[0] || "", "").trim();

        return { title, body };
    }

// Используем
    const { title, body } = formatMessage(message);


    return (
        <div className="relative">
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpanded(false)}
                    />
                )}
            </AnimatePresence>

            <p className="text-xl relative z-20">Центр уведомлений</p>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    type: "tween",
                    duration: 0.4,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            >
                <motion.div
                    className="relative h-fit z-20 flex flex-col bg-black/30 rounded-3xl backdrop-blur-sm p-4  my-4 overflow-hidden"
                    onClick={handleClick}
                    animate={{
                        scale: expanded ? 1.02 : 1,
                        height: expanded ? 180 : 80
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="logo" className="w-13 h-13" />
                            <div>
                                <h2 className="font-bold text-xl">{title}</h2>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 text-sm"
                                >
                                    {body}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
