import React, { useState, useEffect } from "react";
import { BsXCircle } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { addListToBoard, getListByBoardId, updateListPosition } from "../indexedDB";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots, BsPlusLg } from "react-icons/bs";

const SortableItem: React.FC<{ id: number; name: string }> = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
      <div
        ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="bg-slate-800 mx-2 px-4 py-1 rounded-lg w-72"
      >
        {/* Heading */}
        <div className="flex items-center justify-between mt-3">
            {name}
            <BsThreeDots />
          </div>
          
          {/* Cards */}
          <div className="bg-slate-600 my-3 p-2 rounded-lg">
              <span>Bug No. 1</span>
              <h5 className="mt-2">#1</h5>
          </div>

          {/* Add a card */}
          <div className="flex items-center mt-4 mb-2">
                <BsPlusLg />
                <h3 className="ml-2">Add a card</h3>
          </div>
    </div>
  );
};

const List: React.FC = () => {
    const [showAddListInput, setShowAddListInput] = useState(false);
    const [listName, setListName] = useState("");
    const [lists, setLists] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchItems = async () => {
            const boardId = parseInt(id!, 10);
            const fetchedLists = await getListByBoardId(boardId);
            const sortedLists = fetchedLists.sort((a, b) => a.position - b.position); // Sort by position
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
            setLists((prevLists) => [...prevLists, { ...newItem, id: Date.now() }]); // Temporarily add with a unique id
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

            return updatedLists.map((list, index) => ({ ...list, position: index }));
            });
        }
    };


  return (
        <>

        {/* Add List Card */}
        <section className="p-4 md:w-4/12 w-6/12">
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
            <div className="bg-slate-900 px-4 py-2 rounded-md">
                <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                className="w-full rounded px-2 py-1 text-slate-800"
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
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={lists} strategy={horizontalListSortingStrategy}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {lists.map((list) => (
                    <SortableItem key={list.id} id={list.id} name={list.name} />
                ))}
                </div>
            </SortableContext>
            </DndContext>
        </section>
    </>
  );
};

export default List;