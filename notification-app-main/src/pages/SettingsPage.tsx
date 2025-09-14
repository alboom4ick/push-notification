import {SettingsInfo} from "../components/main/SettingsInfo.tsx";
import {EventManageSettings} from "../components/settings/EventManageSettings.tsx";
import {HumorControl} from "../components/settings/HumorControl.tsx";
import {ToneOfVoiceList} from "../components/settings/ToneOfVoiceList.tsx";
import {Container} from "../components/shared/Container.tsx";
import {Header} from "../components/shared/Header.tsx";
import {PushPromptSettings} from "../components/settings/PushPromptSettings.tsx";

export default function SettingsPage() {
    return (
        <>
            <Header />
            <SettingsInfo />
            <Container className={"max-w-lg mx-auto mt-10"}>
                <EventManageSettings />
                <HumorControl />
                <PushPromptSettings />
                <ToneOfVoiceList />
            </Container>
        </>
    )
}