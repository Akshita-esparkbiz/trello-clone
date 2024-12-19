// components/Index.tsx
import React, {useState} from "react";
import Sidebar from './Sidebar';
import List from './List';

const MainPage: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className={isSidebarOpen ? "col-span-8" : "col-span-11"}>
                    <List />
                </div>
            </div>
        </>
    );
};

export default MainPage;
