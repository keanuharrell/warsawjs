import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

const client = new DynamoDBClient({});

export const UserEntity = new Entity(
  {
    model: {
      entity: "user",
      version: "1",
      service: "warsawjs",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
      },
      email: {
        type: "string",
        required: true,
      },
      displayName: {
        type: "string",
        required: true,
      },
      createdAt: {
        type: "string",
        required: true,
        readOnly: true,
        default: () => new Date().toISOString()
      },
      updatedAt: {
        type: "string",
        required: true,
        readOnly: true,
        default: () => new Date().toISOString(),
        set: () => new Date().toISOString()
      }
    },
    indexes: {
      // Primary: USER#<userId> | METADATA
      primary: {
        pk: {
          field: "pk",
          composite: ["userId"],
          template: "USER#${userId}"
        },
        sk: {
          field: "sk",
          composite: [],
          template: "METADATA"
        }
      },
      // GSI1: Par email pour login
      byEmail: {
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: "gsi1pk",
          composite: ["email"],
          template: "EMAIL#${email}"
        },
        sk: {
          field: "gsi1sk",
          composite: ["userId"],
          template: "USER#${userId}"
        }
      }
    }
  },
  {
    client,
    table: Resource.Dynamo.name,
  }
)

export const UserDB = {
  async create(params: {
    userId: string;
    email: string;
    displayName: string;
  }) {
    return await UserEntity.create(params).go();
  },

  async get(userId: string) {
    const result = await UserEntity.get({ userId }).go();
    return result.data;
  },

  async getByEmail(email: string) {
    const result = await UserEntity.query
      .byEmail({ email })
      .go();
    return result.data?.[0];
  },

  async update(userId: string, updates: any) {
    const result = await UserEntity.update({ userId })
      .set(updates)
      .go();
    return result.data;
  },


  async delete(userId: string) {
    await UserEntity.delete({ userId }).go();
  }
};