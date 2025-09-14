import { motion } from "framer-motion";
import { Container } from "../shared/Container.tsx";

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

export const WelcomeInfo = () => {
    const text =
        "Наша система анализирует ваши расходы и финансовое поведение, чтобы предлагать именно те продукты и услуги, которые принесут вам реальную выгоду. Больше никаких общих рассылок — только персонализированные рекомендации.";

    return (
        <Container className={" mt-50"}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-lg text-center leading-relaxed text-gray-800"
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
        </Container>
    );
};
