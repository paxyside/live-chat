import type {AuthPayload} from "@/types";
import {generateMockPayload, serializePayloadToInitData} from "./authPayload";
import {retrieveRawInitData} from "@telegram-apps/sdk";

export const getInitData = (): string => {
  let initData = retrieveRawInitData();
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