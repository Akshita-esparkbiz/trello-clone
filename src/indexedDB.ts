import { openDB } from 'idb';

const DB_NAME = 'workspace';
const DB_VERSION = 1;
const BOARD_STORE_NAME = 'Boards';

// Initialize IndexedDB
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(BOARD_STORE_NAME)) {
        db.createObjectStore(BOARD_STORE_NAME, {
          keyPath: 'id', // Auto increment the ID or use a unique ID from your data
          autoIncrement: true,
        });
      }
    },
  });
  return db;
};

// Add an item to the store
export const addItem = async (item: any) => {
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
