import { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { motion } from "framer-motion";
import { Dropdown } from "primereact/dropdown";
import {getPushTemplateById, getPushTemplates, patchPushTemplate} from "../../api/axiosInstance.ts";


interface Template {
    id: number;
    label:string;
    text: string;
}

export function PushPromptSettings() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [prompt, setPrompt] = useState<string>("");

    useEffect(() => {
        const loadTemplates = async () => {
            const data = await getPushTemplates();
            if (data) {
                setTemplates(data);
                setSelectedTemplate(data[0]?.id || null);
                setPrompt(data[0]?.text || "");
            }
        };
        loadTemplates();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            getPushTemplateById(selectedTemplate).then((data) => {
                if (data) setPrompt(data.text);
            });
        }
    }, [selectedTemplate]);

    const savePrompt = async () => {
        if (!selectedTemplate) return;
        await patchPushTemplate(selectedTemplate, prompt);
        alert("Промпт успешно сохранён ✅");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, delay: 0.6 }}
            className="p-6 border w-full mx-auto my-5 border-gray-300 rounded-2xl bg-white"
        >
            <h2 className="text-xl font-semibold mb-4">
                Изменение шаблона для пуш-уведомлений
            </h2>

            <Dropdown
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.value)}
                options={templates.map((t) => ({ label: t.label, value: t.id }))}
                placeholder="Выберите шаблон"
                className="w-full mb-4"
            />

            <label className="block text-gray-700 mb-2">
                Текст уведомления:
            </label>

            <InputTextarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                autoResize
                className="w-full mb-4"
            />

            <button
                onClick={savePrompt}
                className="w-full bg-[#29B56E] mt-2 text-white py-2 rounded-lg hover:bg-green-600 cursor-pointer transition"
            >
                Сохранить промпт
            </button>
        </motion.div>
    );
}
