import {ApplyInfo} from "../components/apply/ApplyInfo.tsx";
import {Header} from "../components/shared/Header.tsx";




export default function ApplyPage() {
    return (
        <>
            <Header />
            <ApplyInfo
                product="Премиальная карта"
                description="Эта карта позволяет путешествовать по всему миру с удобным управлением и мгновенной активацией."
            />
        </>
    )
}
