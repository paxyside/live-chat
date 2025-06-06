import type {AuthPayload} from "@/types";

export function generateMockPayload(): AuthPayload {
  const mockUserId = Math.floor(Math.random() * 100000);
  const mockChatId = Math.floor(Math.random() * 1000000);
  const mockUsername = `dev_user_${mockUserId}`;
  return {
    user: {
      id: mockUserId,
      is_bot: false,
      first_name: "Dev",
      last_name: "User",
      username: mockUsername,
      language_code: "en",
    },
    chat_id: mockChatId,
    auth_date: Math.floor(Date.now() / 1000),
    hash: "mock_hash",
  };
}

export function serializePayloadToInitData(payload: AuthPayload): string {
  return new URLSearchParams(
    Object.entries(payload).map(([key, val]) => [
      key,
      typeof val === "object" ? JSON.stringify(val) : String(val),
    ]),
  ).toString();
}
