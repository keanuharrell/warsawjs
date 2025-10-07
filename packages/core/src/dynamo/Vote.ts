import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const VoteEntity = new Entity(
  {
    model: {
      entity: "Vote",
      version: "1",
      service: "warsawjs",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
      },
      option: {
        type: ["A", "B", "C", "D"] as const,
        required: true,
      },
      timestamp: {
        type: "number",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  { table: process.env.TABLE_NAME || "", client: new DynamoDBClient({}) }
);

export const VoteDB = {
  upsert: async (vote: { userId: string; option: "A" | "B" | "C" | "D"; timestamp: number }) => {
    const result = await VoteEntity.upsert(vote).go();
    return result.data;
  },

  list: async () => {
    const result = await VoteEntity.scan.go({ limit: 10000 });
    return result.data;
  },

  count: async () => {
    const votes = await VoteDB.list();
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    votes.forEach((vote) => {
      counts[vote.option]++;
    });
    return counts;
  },

  clear: async () => {
    const votes = await VoteDB.list();
    await Promise.all(
      votes.map((vote) => VoteEntity.delete({ userId: vote.userId }).go())
    );
  },
};
