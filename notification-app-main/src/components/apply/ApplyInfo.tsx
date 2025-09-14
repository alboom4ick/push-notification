import { useState } from "react";
import { Container } from "../shared/Container.tsx";
import { ApplyModal } from "./ApplyModal.tsx";
import TravelCardImg from "../../assets/cards/travel-card.png";
import BlackCardImg from "../../assets/cards/black-card.png";

interface ApplyInfoProps {
    product: string;
    description: string;
}

export function ApplyInfo({ product,  description }: ApplyInfoProps) {
    const [show, setShow] = useState(false);


    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
            <Container className="max-w-md w-full">
                <h2 className="font-semibold text-center text-3xl text-[#29b56e] mb-10">
                    Оформление продукта
                </h2>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-center opacity-80 text-sm mb-4">
                        <p>Продукт</p>
                        <h3 className="font-medium text-xl">{product}</h3>
                    </div>
                    <div className="flex justify-center mb-4">
                        <img src={getImgByProduct(product)} className="w-100 h-100  object-cover" alt={product} />
                    </div>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>

                <button
                    onClick={() => setShow(true)}
                    className="w-full bg-[#29b56e] hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                    Оформить продукт
                </button>
            </Container>

            <ApplyModal show={show} onClose={() => setShow(false)} />
        </div>
    );
}


function getImgByProduct(product: string) {
    switch (product) {
        case "Карта для путешествий":
            return TravelCardImg;
        case "Премиальная карта":
            return BlackCardImg;
        default:
            return "Неизвестный продукт";
    }
}