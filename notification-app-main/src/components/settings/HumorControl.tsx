import { Slider } from "primereact/slider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../shared/Container.tsx";
import "../../styles/custom.css";
import {getHumorLevel, patchHumorLevel} from "../../api/axiosInstance.ts";

export function HumorControl() {
    const [humor, setHumor] = useState<number>(50);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchHumor = async () => {
            try {
                const data = await getHumorLevel();
                if (data?.level !== undefined) {
                    setHumor(data.level);
                }
            } catch (err) {
                console.error("Ошибка при получении уровня юмора:", err);
            }
        };
        fetchHumor();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await patchHumorLevel(humor);
        } catch (err) {
            console.error("Ошибка при сохранении уровня юмора:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: 0.4 }}
                className="p-6 border w-full mx-auto border-gray-300 rounded-2xl bg-white"
            >
                <h2 className="text-xl font-semibold mb-4">
                    Регулировка уровня юмора
                </h2>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700">Уровень юмора:</span>
                    <span className="font-bold text-green-600">{humor}%</span>
                </div>

                <Slider
                    value={humor}
                    onChange={(e) => setHumor(e.value as number)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full custom-slider"
                />

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`w-full mt-10 text-white py-2 rounded-lg transition 
                        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#29B56E] hover:bg-green-600"}`}
                >
                    {loading ? "Сохранение..." : "Сохранить"}
                </button>
            </motion.div>
        </Container>
    );
}
