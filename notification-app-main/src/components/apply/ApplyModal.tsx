import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
    show: boolean;
    onClose: () => void;
}

export function ApplyModal({ show, onClose }: SuccessModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        className="bg-white rounded-2xl p-8 w-120 flex flex-col items-center shadow-xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, 15, -10, 0] }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-16 h-16 bg-[#29B56E] rounded-full flex items-center justify-center mb-4 text-white text-3xl"
                        >
                            ✓
                        </motion.div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Успешно оформлено!</h3>
                        <p className="text-gray-600 text-center mb-6">Ваш продукт успешно оформлен. Спасибо за использование нашего сервиса.</p>

                        <button
                            onClick={onClose}
                            className="bg-[#29B56E] hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition"
                        >
                            Закрыть
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
