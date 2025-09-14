import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export function SettingsInfo() {
    const text ="Настройте уведомления под себя";
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl mt-20 text-bold  text-center leading-relaxed text-gray-800"
        >
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    variants={wordVariants}
                    className="inline-block mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};
