import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

export const DemoStateEntity = new Entity(
  {
    model: {
      entity: "DemoState",
      version: "1",
      service: "warsawjs",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        default: "current", // Single record for current state
      },
      mode: {
        type: ["waiting", "chat", "vote"] as const,
        required: true,
        default: "waiting",
      },
      chatEnabled: {
        type: "boolean",
        required: true,
        default: false,
      },
      voteEnabled: {
        type: "boolean",
        required: true,
        default: false,
      },
      updatedAt: {
        type: "number",
        required: true,
        default: () => Date.now(),
        readOnly: true,
        set: () => Date.now(),
      },
      createdAt: {
        type: "number",
        required: true,
        default: () => Date.now(),
        readOnly: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  { table: Resource.Dynamo.name, client: new DynamoDBClient({}) }
);

export type DemoState = {
  id: string;
  mode: "waiting" | "chat" | "vote";
  chatEnabled: boolean;
  voteEnabled: boolean;
  updatedAt: number;
  createdAt: number;
};

export const DemoStateDB = {
  get: async () => {
    const result = await DemoStateEntity.get({ id: "current" }).go();
    return result.data;
  },

  update: async (state: Partial<Pick<DemoState, "mode" | "chatEnabled" | "voteEnabled">>) => {
    const result = await DemoStateEntity.upsert({
      id: "current",
      ...state,
    }).go();
    return result.data;
  },

  reset: async () => {
    const result = await DemoStateEntity.upsert({
      id: "current",
      mode: "waiting",
      chatEnabled: false,
      voteEnabled: false,
    }).go();
    return result.data;
  },
};
