import { useEffect, useState } from "react";
import "../../styles/custom.css";
import { PlusIcon, XIcon } from "lucide-react";
import {postTomOfVoice, getTomOfVoice, removePostTomOfVoice} from "../../api/axiosInstance.ts";

interface Parameter {
    id: number;
    label: string;
}

export function ToneOfVoiceList() {
    const [parameters, setParameters] = useState<Parameter[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        const fetchParameters = async () => {
            const data = await getTomOfVoice();
            if (data) setParameters(data);
        };
        fetchParameters();
    }, []);

    const handleAdd = async (label: string) => {
        if (!label.trim()) return;

        const newParam = await postTomOfVoice(label);
        if (newParam) {
            setParameters((prev) => [...prev, newParam]);
            setInput("");
        }
    };

    const handleDelete = async (id: number) => {
        const deleted = await removePostTomOfVoice(id);
        if (deleted) {
            setParameters((prev) => prev.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="mx-auto bg-white my-5 border border-gray-300 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Tone of Voice</h2>
            <ul className="space-y-2">
                {parameters.map((parameter) => (
                    <li
                        key={parameter.id}
                        className="flex justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                    >
                        <div>
                            <label className="ml-2">{parameter.label}</label>
                        </div>
                        <XIcon
                            width={15}
                            className="cursor-pointer"
                            onClick={() => handleDelete(parameter.id)}
                        />
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-4 justify-center h-10 mt-10">
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    className="w-full h-full bg-white border-2 rounded-xl pl-4 pr-10 border-gray-200 focus:border-gray-400 focus:outline-none"
                />
                <button
                    onClick={() => handleAdd(input)}
                    className="w-[30%] h-full flex justify-center items-center gap-1 bg-gray-500 rounded-lg text-white"
                >
                    <PlusIcon width={17} />
                    ADD
                </button>
            </div>

            <button
                className="w-full mt-10 bg-[#29B56E] text-white py-2 rounded-lg hover:bg-green-600 cursor-pointer transition"
            >
                Сохранить
            </button>
        </div>
    );
}
