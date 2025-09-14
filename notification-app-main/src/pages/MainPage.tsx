import {WelcomeInfo} from "../components/main/WelcomeInfo.tsx";
import {DataForm} from "../components/main/DataForm.tsx";
import {Header} from "../components/shared/Header.tsx";


export default function MainPage() {
    return (
        <>
            <Header />
            <WelcomeInfo />
            <DataForm />

        </>
    )
}