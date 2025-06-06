import type {AuthPayload} from "@/types";
import {generateMockPayload, serializePayloadToInitData} from "./authPayload";

export const getInitData = (): string => {
  let initData = window.Telegram?.WebApp?.initData;
  if (!initData) {
    let mockPayload: AuthPayload | null = JSON.parse(
      sessionStorage.getItem("mockPayload") || "null"
    );
    if (!mockPayload) {
      mockPayload = generateMockPayload();
      sessionStorage.setItem("mockPayload", JSON.stringify(mockPayload));
    }
    initData = serializePayloadToInitData(mockPayload);
  }
  return initData;
};