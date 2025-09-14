export function PhoneTime() {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString("ru-RU", { weekday: "long" });
    const date = now.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });


    return (
        <div className="text-center leading-[1] my-10">
            <p className="text-[18px]">{`${dayOfWeek}, ${date}`}</p>
            <p className="text-[100px] font-bold">{time}</p>
        </div>
    )
}