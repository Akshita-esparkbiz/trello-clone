import React, { useState, useEffect } from "react";
import { getAllItems, addBoard, deleteItem, updateBoard } from "../indexedDB";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface addListProps {
    addList: boolean;
    setAddList: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarBoardList: React.FC<addListProps> = ({ addList = false, setAddList }) => {
    const [items, setItems] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [editBoardInput, setEditBoardInput] = useState<Record<number, boolean>>({});
    const [editInputValues, setEditInputValues] = useState<Record<number, string>>({});
    const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});
    const colors = [
        "from-indigo-500",
        "from-red-500",
        "from-blue-500",
        "from-green-500",
        "from-yellow-500",
        "from-fuchsia-500",
        "from-purple-500",
        "from-teal-500",
        "from-orange-500",
        "from-cyan-500",
    ];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            const allItems = await getAllItems();
            const itemsWithColors = allItems.map((item: any) => ({
                ...item,
                color: item.color || colors[Math.floor(Math.random() * colors.length)],
            }));
            setItems(itemsWithColors);
        };
        fetchItems();
    }, []);

    const handleAddItem = async () => {
        if (inputValue) {
            const newItem = {
                name: inputValue,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
            await addBoard(newItem);
            setInputValue("");
            const updatedItems = await getAllItems();
            const itemsWithColors = updatedItems.map((item: any) => ({
                ...item,
                color: item.color || colors[Math.floor(Math.random() * colors.length)],
            }));
            setItems(itemsWithColors);
            setAddList(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddItem();
        }
    };

    const toggleDropdown = (id: number) => {
        setDropdownStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const deleteBoard = async (id: number) => {
        await deleteItem(id);
        const updatedItems = await getAllItems();
        const itemsWithColors = updatedItems.map((item: any) => ({
            ...item,
            color: item.color || colors[Math.floor(Math.random() * colors.length)],
        }));
        setItems(itemsWithColors);
    };

    const closeBoardInput = () => {
        setInputValue("");
        setAddList(false);
    };

    const handleEditClick = (id: number, currentName: string) => {
        setEditInputValues((prev) => ({
            ...prev,
            [id]: currentName,
        }));
        setEditBoardInput((prev) => ({
            ...prev,
            [id]: true,
        }));
        setDropdownStates((prev) => ({
            ...prev,
            [id]: false,
        }));
    };

    const handleEditInputChange = (id: number, value: string) => {
        setEditInputValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleEditSave = async (id: number) => {
        const updatedName = editInputValues[id];

        // Update the board in the IndexedDB
        await updateBoard(id, { name: updatedName });

        // Hide the input field after saving
        setEditBoardInput((prev) => ({
            ...prev,
            [id]: false,
        }));

        // Update the items in the state
        const updatedItems = await getAllItems();
        const itemsWithColors = updatedItems.map((item: any) => ({
            ...item,
            color: item.color || colors[Math.floor(Math.random() * colors.length)],
        }));
        setItems(itemsWithColors);
    };


    return (
        <>
            <ul className="board-list mt-4">
                {addList && (
                    <li className="text-slate-400 flex items-center space-between mb-3">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type="text"
                            placeholder="Enter Board Name"
                            className="rounded-l grow block py-1 pl-1 pr-1 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm w-full"
                        />
                        <span
                            onClick={closeBoardInput}
                            className="cursor-pointer bg-red-400 p-1 rounded-r"
                        >
                            <BiX className="text-2xl text-white" />
                        </span>
                    </li>
                )}
                {items.map((item) => {
                    const isDropdownOpen = dropdownStates[item.id] || false;
                    const isEditing = editBoardInput[item.id] || false;

                    return (
                        <li key={item.id} className="text-slate-300 flex items-center justify-between mb-3">
                            {!isEditing ? (
                                <>
                                    {/* Board name */}
                                    <button onClick={() => navigate(`/board/${item.id}`)}>
                                        <div className="flex items-center">

                                            {/* color cube */}
                                            <div
                                                className={`h-6 w-7 mr-2 rounded bg-gradient-to-r ${item.color}`}
                                            ></div>
                                            <div>
                                                {item.name}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown(item.id)}
                                            className="inline-flex items-center p-2"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 dark:divide-gray-600">
                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                    <li className="cursor-pointer">
                                                        <a
                                                            onClick={() => handleEditClick(item.id, item.name)}
                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Edit
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            onClick={() => deleteBoard(item.id)}
                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            Delete
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <input
                                        value={editInputValues[item.id] || ""}
                                        onChange={(e) => handleEditInputChange(item.id, e.target.value)}
                                        type="text"
                                        className="rounded-l block py-1 pl-1 pr-1 w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    />
                                    <button
                                        onClick={() => handleEditSave(item.id)}
                                        className="bg-emerald-600 p-1 rounded-r text-white sm:text-sm"
                                    >
                                        Save
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default SidebarBoardList;
