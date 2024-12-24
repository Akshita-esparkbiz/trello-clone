import React, { useState, useEffect } from "react";
import { BsXCircle, BsThreeDots, BsPlusLg } from "react-icons/bs";
import { useParams } from "react-router-dom";
import {
  addListToBoard,
  getListByBoardId,
  updateListPosition,
  addCardToList,
  getCardsByList,
} from "../indexedDB";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem: React.FC<{ id: number; name: string }> = ({ id, name }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    const [showCardInput, setShowCardInput] = useState(false);
    const [cardDescription, setCardDescription] = useState("");
    const [cards, setCards] = useState<any[]>([]);

    // Fetch cards dynamically for the list
    useEffect(() => {
        const fetchCards = async () => {
        const data = await getCardsByList(id); // Fetch cards for the specific list ID
        setCards(data);
        };
        fetchCards();
    }, [id]);

    // Create a new card for the list
    const createCard = async () => {
        if (cardDescription) {
        const ListId = id;
        const newItem = {
            title: cardDescription,
        };

        const retval = await addCardToList(newItem, ListId);
        if (retval) {
            setCards((prevCards) => [...prevCards, retval]); // Add the new card to state
            setShowCardInput(false);
            setCardDescription("");
        }
        }
    };

    const closeCardInput = () => {
        setShowCardInput(false);
        setCardDescription("");
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-slate-800 rounded-lg w-72"
        >
            {/* List Header */}
            <div className="flex items-center justify-between px-4 py-3 rounded-l-lg sticky top-0 bg-slate-800">
                {name}
                <BsThreeDots />
            </div>

            {/* Cards */}
            {cards.map((card) => (
                <div key={card.id} className="px-4">
                    <div className="bg-slate-600 my-3 p-2 rounded-lg">
                        <span className="break-words">{card.title}</span>
                        <h5 className="mt-2">#{card.id}</h5>
                    </div>
                </div>
            ))}

            {/* Add Card Input */}
            {!showCardInput ? (
                <button
                type="button"
                className="w-full py-4 shadow-lg sticky bottom-0 bg-slate-900 px-4 py-1"
                onClick={() => setShowCardInput(true)}
                >
                    <div className="flex items-center">
                        <BsPlusLg />
                        <h3 className="ml-2">Add a card</h3>
                    </div>
                </button>
            ) : (
                <div className="bg-slate-900 py-4 sticky bottom-0 px-4 py-1">
                <input
                    type="text"
                    value={cardDescription}
                    onKeyDown={(e) => {
                        if (e.code === "Space") {
                            e.preventDefault();
                            setCardDescription(cardDescription + " ");
                        }
                    }}
                    onChange={(e) => {
                        setCardDescription(e.target.value);
                    }}
                    placeholder="Enter a title..."
                    className="w-full rounded px-2 py-1 text-white placeholder-slate-300 bg-slate-500 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-2">
                    <button
                    className="px-2 py-1 rounded-md bg-blue-300 text-slate-800 font-medium"
                    onClick={createCard}
                    >
                    Add Card
                    </button>
                    <button onClick={closeCardInput}>
                        <BsXCircle className="text-xl" />
                    </button>
                </div>
                </div>
            )}
        </div>
    );
};

const List: React.FC = () => {
    const [showAddListInput, setShowAddListInput] = useState(false);
    const [listName, setListName] = useState("");
    const [lists, setLists] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, keyboardSensor);

    useEffect(() => {
        const fetchItems = async () => {
        const boardId = parseInt(id!, 10);
        const fetchedLists = await getListByBoardId(boardId);
        const sortedLists = fetchedLists.sort((a, b) => a.position - b.position);
        setLists(sortedLists);
        };
        fetchItems();
    }, [id]);

    const createList = async () => {
        if (listName) {
        const boardId = parseInt(id!, 10);
        const newItem = {
            name: listName,
            position: lists.length, // New list gets the next available position
        };
        await addListToBoard(newItem, boardId);
        setLists((prevLists) => [
            ...prevLists,
            { ...newItem, id: Date.now() }, // Temporarily add with a unique id
        ]);
        setShowAddListInput(false);
        setListName("");
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
        setLists((prevLists) => {
            const oldIndex = prevLists.findIndex((item) => item.id === active.id);
            const newIndex = prevLists.findIndex((item) => item.id === over?.id);

            const updatedLists = arrayMove(prevLists, oldIndex, newIndex);

            // Persist the new positions in IndexedDB
            updatedLists.forEach(async (list, index) => {
            await updateListPosition(list.id, index);
            });

            return updatedLists.map((list, index) => ({
            ...list,
            position: index,
            }));
        });
        }
    };

    return (
        <>
        {/* Add List Card */}
        <section className="py-4 px-2 w-full md:w-4/12">
            {!showAddListInput && (
            <div
                className="flex items-center px-4 py-2 rounded-md bg-teal-300 bg-opacity-50 cursor-pointer"
                onClick={() => setShowAddListInput(true)}
            >
                <h5 className="font-bold">+ Add another List</h5>
            </div>
            )}

            {/* Input New List Card */}
            {showAddListInput && (
            <div className="bg-slate-800 px-4 py-4 rounded-md">
                <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                className="w-full rounded px-2 py-1 text-white placeholder-slate-300 bg-slate-500 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-2">
                <button
                    className="px-2 py-1 rounded-md bg-blue-300 text-slate-800 font-medium"
                    onClick={createList}
                >
                    Add List
                </button>
                <button onClick={() => setShowAddListInput(false)}>
                    <BsXCircle className="text-xl" />
                </button>
                </div>
            </div>
            )}
        </section>

        {/* Show Lists */}
        <section className="py-4 overflow-x-auto">
            <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            >
                <SortableContext
                    items={lists}
                    strategy={horizontalListSortingStrategy}
                >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {lists.map((list) => (
                            <div className="h-[85vh] overflow-y-auto overflow-x-hidden mx-2
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:rounded-r-full
                                [&::-webkit-scrollbar-track]:bg-slate-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-slate-300
                                dark:[&::-webkit-scrollbar-track]:bg-slate-900
                                dark:[&::-webkit-scrollbar-thumb]:bg-gray-500"
                            >
                                <SortableItem key={list.id} id={list.id} name={list.name} />
                            </div>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </section>
        </>
    );
};

export default List;
