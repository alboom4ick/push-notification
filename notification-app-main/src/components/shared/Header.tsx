import { useState } from "react";
import { Container } from "./Container.tsx";
import Logo from "../../assets/logo.svg";
import { Home, Settings, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";

export const Header = () => {
    const [visible, setVisible] = useState(false);

    return (
        <header className="border-y-2 border-gray-200 py-2 max-[512px]:px-4">
            <Container className="flex items-center max-[512px]:justify-between">
                <Link to={"/"}>
                    <img src={Logo} className="w-40 h-fit max-[512px]:w-30" alt="logo" />
                </Link>

                <div className="max-[512px]:hidden flex gap-4 ml-auto">
                    <Link
                        to={"/"}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl bg-[#29B56E] text-white font-medium hover:bg-green-700 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Main
                    </Link>
                    <Link
                        to={"/settings"}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer bg-[#29B56E] text-white font-medium hover:bg-green-700 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </div>
                <button className={"hidden max-[512px]:block"} onClick={() => setVisible(true)}>
                    <Menu className="w-6 h-6 text-gray-500" />
                </button>

                <Sidebar
                    visible={visible}
                    position="right"
                    onHide={() => setVisible(false)}
                    className="w-64"
                >
                    <nav className="flex flex-col gap-2 mt-6">
                        <Link
                            to={"/"}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl  text-black font-medium hover:bg-green-200 transition"
                            onClick={() => setVisible(false)}
                        >
                            <Home className="w-5 h-5" />
                            Main
                        </Link>
                        <Link
                            to={"/settings"}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl  text-black font-medium hover:bg-green-200 transition"
                            onClick={() => setVisible(false)}
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </Link>
                    </nav>
                </Sidebar>
            </Container>
        </header>
    );
};
