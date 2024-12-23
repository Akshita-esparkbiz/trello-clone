import { openDB } from 'idb';

const DB_NAME = 'workspace';
const DB_VERSION = 1;
const BOARD_STORE_NAME = 'Boards';
const LISTS_STORE_NAME = 'Lists';

// Initialize IndexedDB
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(BOARD_STORE_NAME)) {
        db.createObjectStore(BOARD_STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(LISTS_STORE_NAME)) {
        db.createObjectStore(LISTS_STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    },
  });
  return db;
};


// FOR BOARD

// Add an item to the store
export const addBoard = async (item: any) => {
  const db = await initDB();
  await db.add(BOARD_STORE_NAME, item);
};

// Get all items from the store
export const getAllItems = async () => {
  const db = await initDB();
  return await db.getAll(BOARD_STORE_NAME);
};

// Get a specific item by ID
export const getItemById = async (id: number) => {
  const db = await initDB();
  return await db.get(BOARD_STORE_NAME, id);
};

// Delete an item by ID
export const deleteItem = async (id: number) => {
  const db = await initDB();
  await db.delete(BOARD_STORE_NAME, id);
  console.log(`Item with id ${id} deleted`);
};

// Update an item by ID in the store
export const updateBoard = async (id: number, updatedItem: any) => {
  const db = await initDB();
  await db.put(BOARD_STORE_NAME, { ...updatedItem, id });
};

// FOR LISTS

// Add an list to the store
export const addListToBoard = async (list: any, boardId: number) => {
  const db = await initDB();
  const position = (await db.getAll(LISTS_STORE_NAME)).length; // Assign position as the current count
  await db.add(LISTS_STORE_NAME, { ...list, boardId, position });
};


// Get the list related to board ID
export const getListByBoardId = async (boardId: number) => {
  const db = await initDB();
  const allLists = await db.getAll(LISTS_STORE_NAME);
  return allLists
    .filter((list: any) => list.boardId === boardId)
    .sort((a, b) => a.position - b.position); // Sort by position
};


// Update the list order
export const updateListPosition = async (listId: number, newPosition: number) => {
  const db = await initDB();
  const transaction = db.transaction(LISTS_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(LISTS_STORE_NAME);

  try {
    const list = await store.get(listId);
    if (!list) {
      throw new Error(`List with id ${listId} not found`);
    }

    // Update the position
    list.position = newPosition;
    await store.put(list);

    console.log(`List with id ${listId} updated to position ${newPosition}`);
  } catch (error) {
    console.error(`Failed to update position for list with id ${listId}:`, error);
  } finally {
    await transaction.done;
  }
};
