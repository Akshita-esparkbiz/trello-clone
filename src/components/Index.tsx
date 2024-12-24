// components/Index.tsx
import React, {useState} from "react";
import Sidebar from './Sidebar';
import WelcomeBoard from './WelcomeBoard';
import List from './List';
import { useParams } from "react-router-dom";

const MainPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { id } = useParams();
    
    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className={isSidebarOpen ? "col-span-6 md:col-span-8" : "col-span-11"}>
                    {!id ?
                        <WelcomeBoard />
                        : (
                        <List />
                    )}
                </div>
            </div>
        </>
    );
};

export default MainPage;
