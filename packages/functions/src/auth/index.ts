import { auth } from "@askmyroom/core";
import { handle } from "hono/aws-lambda";

export const handler = handle(auth);
