import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ChatMessageEntity = new Entity(
  {
    model: {
      entity: "ChatMessage",
      version: "1",
      service: "warsawjs",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      text: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
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
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["timestamp", "id"],
        },
      },
    },
  },
  { table: process.env.TABLE_NAME || "", client: new DynamoDBClient({}) }
);

export const ChatMessageDB = {
  create: async (message: { id: string; text: string; username: string; timestamp: number }) => {
    const result = await ChatMessageEntity.create(message).go();
    return result.data;
  },

  list: async (limit = 100) => {
    const result = await ChatMessageEntity.query.primary({})
      .go({ limit, order: "desc" });
    return result.data.reverse(); // Oldest first
  },

  clear: async () => {
    const messages = await ChatMessageDB.list(1000);
    await Promise.all(
      messages.map((msg) =>
        ChatMessageEntity.delete({ id: msg.id, timestamp: msg.timestamp }).go()
      )
    );
  },
};
