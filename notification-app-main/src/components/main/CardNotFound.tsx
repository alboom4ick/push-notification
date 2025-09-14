import { SearchX } from "lucide-react";

export function CardNotFound() {
    return (
        <div className="flex flex-col items-center justify-center p-6  rounded-xl  ">
            <SearchX className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Ничего не найдено</h3>
            <p className="text-gray-500 text-sm mt-1 text-center">
                Попробуйте изменить запрос или ввести другое слово.
            </p>
        </div>
    );
}
