import Dexie, { Table } from "dexie";

export interface WaterEvent {
  ts: number;
}

export class WaterDBDexie extends Dexie {
  events!: Table<WaterEvent>;

  constructor() {
    super("WaterDB");
    this.version(1).stores({
      events: "ts", // ts is an integer
    });
  }
}

export const db = new WaterDBDexie();
