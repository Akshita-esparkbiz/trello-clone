import React, { useState, useEffect } from "react";
import { getAllItems, addItem } from "../indexedDB";
import { BsThreeDotsVertical } from "react-icons/bs";

interface addListProps {
    addList: boolean;
    setAddList: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarBoardList: React.FC<addListProps> = ({ addList = false, setAddList }) => {
    const [items, setItems] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
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

    useEffect(() => {
        const fetchItems = async () => {
            const allItems = await getAllItems();
            // Assign random colors to each item if not already assigned
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
                color: colors[Math.floor(Math.random() * colors.length)], // Assign a random color
            };
            await addItem(newItem);
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

    return (
        <>
            {/* Board List */}
            <ul className="board-list mt-4">
                {items.map((item) => {
                    const isDropdownOpen = dropdownStates[item.id] || false;

                    return (
                        <li
                            key={item.id}
                            className="text-slate-300 flex items-center justify-between mb-3 cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`h-6 w-7 mr-2 rounded bg-gradient-to-r ${item.color}`}
                                ></div>
                                {item.name}
                            </div>
                            <div className="relative">
                                <button
                                    id={`dropdownMenuIconButton-${item.id}`}
                                    onClick={() => toggleDropdown(item.id)}
                                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    type="button"
                                    aria-expanded={isDropdownOpen}
                                    aria-controls={`dropdownDots-${item.id}`}
                                >
                                    <BsThreeDotsVertical />
                                </button>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div
                                        id={`dropdownDots-${item.id}`}
                                        className="absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                                    >
                                        <ul
                                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby={`dropdownMenuIconButton-${item.id}`}
                                        >
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Edit
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Delete
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}

                {addList && (
                    <li className="text-slate-400 flex items-center space-between mb-3">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type="text"
                            placeholder="Enter Board Name"
                            className="rounded grow block py-1 pl-1 pr-1 text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 w-4"
                        />
                        <span
                            onClick={() => setAddList(false)}
                            className="cursor-pointer"
                        >
                            x
                        </span>
                    </li>
                )}
            </ul>
        </>
    );
};

export default SidebarBoardList;
