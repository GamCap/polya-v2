import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Query, Execution } from "@/types";

interface Data {
  queries: Query[];
  executions: Execution[];
}

const filePath = join(process.cwd(), "db.json");
const adapter = new JSONFile<Data>(filePath);
const db = new Low<Data>(adapter, { queries: [], executions: [] });

async function initDB() {
  await db.read();
  db.data ||= { queries: [], executions: [] };
  await db.write();
}

initDB();

export default db;
