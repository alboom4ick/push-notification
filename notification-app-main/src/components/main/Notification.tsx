import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useEffect} from "react";
import {XIcon} from "lucide-react";

interface NotificationProps {
    title: string;
    message: string;
    icon: React.ReactNode;
    duration?: number;
}

export function Notification({ title, message, icon, duration =5000 }: NotificationProps) {
    const [show, setShow] = React.useState(false);
    const [showDetails, setShowDetails] = React.useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);

            const timer = setTimeout(() => {
                setShow(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setShowDetails(!showDetails)}
                    className="absolute top-5 left-1/2 bg-white -translate-x-1/2 w-md max-w-md backdrop-blur-[5px] shadow-md cursor-pointer rounded-2xl  border border-gray-200 p-4"
                >
                    <div className="flex items-center justify-between ">
                        <div className={"flex items-center gap-5"}>
                            <div className="bg-blue-400 p-4 rounded-full text-white">{icon}</div>

                            <motion.h3
                                className="text-xl font-bold"
                                transition={{ duration: 0.1 }}
                            >
                                {title}
                            </motion.h3>
                        </div>
                        <div>
                            <XIcon onClick={() => setShow(false)} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <motion.p
                                    initial={{  opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, delay:0.4, ease: "easeInOut" }}
                                    className="px-5 mt-5">{message}</motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
