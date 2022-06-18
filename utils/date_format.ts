//
//
//

// deps
import { datetime } from "../deps.ts";

export function timeReadable(time: string): string {
  const date = datetime(time);
  return date.format("YYYY-MM-dd HH:mm");
}

export function yyyyMMdd(date: Date): string {
  const dt = datetime(date);
  return dt.format("YYYYMMdd");
}
