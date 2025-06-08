import type {AuthPayload} from "@/types";
import {generateMockPayload, serializePayloadToInitData} from "./authPayload";
import {retrieveRawInitData} from "@telegram-apps/sdk";

export const getInitData = (): string => {
  try {
    const initData = retrieveRawInitData();
    if (initData) return initData;
  } catch (e) {
    console.warn("Failed to retrieve Telegram init data:", e);
  }

  // Fallback to mock data for local dev
  let mockPayload: AuthPayload | null = null;

  try {
    mockPayload = JSON.parse(sessionStorage.getItem("mockPayload") || "null");
  } catch {
    mockPayload = null;
  }

  if (!mockPayload) {
    mockPayload = generateMockPayload();
    sessionStorage.setItem("mockPayload", JSON.stringify(mockPayload));
  }

  return serializePayloadToInitData(mockPayload);
};