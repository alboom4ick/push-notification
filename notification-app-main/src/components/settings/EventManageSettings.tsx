import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { AnimatePresence, motion } from "framer-motion";
import {getEventsRules, postEventsRules} from "../../api/axiosInstance.ts";

type Event = {
    id: number;
    title: string;
    type: string;
};

const CATEGORIES = [
    "Спорт",
    "Одежда и обувь",
    "Продукты питания",
    "Кафе и рестораны",
    "Медицина",
    "Авто",
    "Развлечения",
    "АЗС",
    "Кино",
    "Питомцы",
    "Книги",
    "Цветы",
    "Едим дома",
    "Смотрим дома",
    "Играем дома",
    "Косметика и Парфюмерия",
    "Подарки",
    "Ремонт дома",
    "Мебель",
    "Спа и массаж",
    "Ювелирные украшения",
    "Такси",
    "Отели",
    "Путешествия",
];

export function EventManageSettings() {
    const [events, setEvents] = useState<Event[]>([]);
    const [newEvent, setNewEvent] = useState("Кайрат против Реал");
    const [desc, setDesc] = useState<string>()
    const [category, setCategory] = useState(CATEGORIES[0]);

    const addEvent = async () => {
        if (!newEvent.trim()) return;

        try {
            const created = await postEventsRules(newEvent, desc, category);
            if (created) {
                setEvents([...events, created]);
            } else {
                setEvents([...events, { id: Date.now(), title: newEvent, type:category }]);
            }
            setNewEvent("");
            setCategory(CATEGORIES[0]);
        } catch (err) {
            console.error("Ошибка при добавлении события", err);
        }
    };

    const deleteEvent = (id: number) => {
        setEvents(events.filter((e) => e.id !== id));
    };

    useEffect(() => {
        (async () => {
            const rules = await getEventsRules();
            if (rules) {
                setEvents(rules);
            }
        })();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className=" bg-white my-5 border border-gray-300 rounded-2xl p-6"
        >
            <h2 className="text-xl font-bold mb-4">Какие события вас интересуют?</h2>

            <ul className="space-y-3 mb-6">
                <AnimatePresence>
                    {events.map((event) => (
                        <motion.li
                            key={event.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                            className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
                        >
                            <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.type}</p>
                            </div>
                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="p-1 text-red-500 rounded-lg hover:bg-red-100 transition"
                            >
                                <XIcon size={18} />
                            </button>
                        </motion.li>
                    ))}
                </AnimatePresence>
                {events.length === 0 && (
                    <p className="text-gray-500 italic">Нет событий</p>
                )}
            </ul>

            <div className="space-y-5">
                <div className="flex flex-col gap-3">
                    <InputText
                        value={newEvent}
                        onChange={(e) => setNewEvent(e.target.value)}
                        placeholder="Название события"
                        className="w-full"
                    />

                    <InputText
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Описание события"
                        className="w-full"
                    />

                    <Dropdown
                        value={category}
                        onChange={(e) => setCategory(e.value)}
                        options={CATEGORIES}
                        placeholder="Выберите категорию"
                        className="w-full"
                        filter
                    />
                </div>

                <button
                    onClick={addEvent}
                    className="w-full bg-[#29B56E] text-white py-2 rounded-lg hover:bg-green-600 cursor-pointer transition"
                >
                    Добавить событие
                </button>
            </div>
        </motion.div>
    );
}
