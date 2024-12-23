import React, {useState} from "react";
import SidebarBoardList from "./SidebarBoardList";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen = true, setIsSidebarOpen }) => {

    const [addList, setAddList] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className={isSidebarOpen ? "md:col-span-2 col-span-4" : "col-span-1"}>
                {isSidebarOpen ? (
                    <section className="sidebar bg-slate-800 h-screen">
                        {/* Main Heading */}
                        <div className="p-4 flex items-center justify-between border-b-2 border-slate-500">
                            <button onClick={() => navigate(`/`)}>
                                <h1 className="flex items-center font-bold text-slate-300">
                                    <div className="h-8 w-10 mr-2 rounded bg-gradient-to-r from-emerald-700 to-emerald-500"></div>
                                    Workspace
                                </h1>
                            </button>

                            {/* Sidebar Icon */}
                            <div className="fill-white cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10.605" height="15.555"><path d="M10.605 12.727 5.656 7.776l4.949-4.948L7.777 0 0 7.776l7.777 7.779 2.828-2.828z" /></svg>
                            </div>
                        </div>

                        {/* Your Boards */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-400">Your boards</h4>

                                {/* Add New Board */}
                                <span className="text-slate-400 text-2xl cursor-pointer">
                                    <BsPlus className="fill-slate-300" onClick={() => setAddList(true)} />
                                </span>
                            </div>
                            <SidebarBoardList addList={addList} setAddList={setAddList} />
                        </div>
                    </section>
                ) : (
                    // Minimized Sidebar
                    <section className="minimizedsidebar bg-slate-800 h-screen w-4">
                        <div className="fill-white expand-sidebar pt-4 pl-2 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                            <svg className="bg-slate-500 rounded" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" /></svg>
                        </div>
                    </section>
                )};
            </div>
        </>
    )
}
export default Sidebar;