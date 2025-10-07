// Read-only token - public, can only subscribe
export const realtimeReadOnlyToken = new sst.Secret("RealtimeReadOnlyToken");

// Write token - for authenticated users, can publish to chat/vote
export const realtimeWriteToken = new sst.Secret("RealtimeWriteToken");
