// backend/create-index.js
import { indices } from "./elastic-client";

const createIndex = async (indexName) => {
  await indices.create({ index: indexName });
  console.log("Index created");
};

createIndex("posts");