import React, { useState } from "react";
import { BsXCircle } from "react-icons/bs";

const List: React.FC = () => {

    const [showAddListInput, setShowAddListInput] = useState(false);

    return (
        <>
            <section className="p-4 w-6/12">
                {/* Add List Card */}
                {!showAddListInput &&
                    <div
                        className="flex item-center px-4 py-2 rounded-md bg-teal-300 bg-opacity-50 cursor-pointer"
                        onClick={() => setShowAddListInput(true)}
                    >
                        <h5 className="font-bold"> +  Add another List </h5>
                    </div>
                }

                {/* Input List */}
                {showAddListInput && 
                    <div className="bg-slate-900 px-4 py-2 rounded-md">
                        <input type="text" placeholder="Enter list name..." className="w-full rounded px-2 py-1" />
                        <div className="flex item-center justify-between mt-2">
                            <button className="px-2 py-1 rounded-md bg-blue-300 text-slate-800 font-medium">Add List</button>
                            <button onClick={() => setShowAddListInput(false)}>
                                <BsXCircle className="text-xl" />
                            </button>
                        </div>
                    </div>
                }
            </section>
        </>
    )
}

export default List;