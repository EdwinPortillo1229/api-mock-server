/**
 * Replaces fixture placeholders with dynamic values.
 * Ports the logic from FixtureApiClient#transform_fixture_placeholders.
 *
 * Supported placeholders:
 *   FIXTURE_ZOOM_USER_ID       → replaced with configured userId
 *   FIXTURE_USER_NAME          → replaced with configured userName
 *   FIXTURE_DATE_DAY_N_TIME_H  → N days ago at hour H, UTC ISO8601
 *   FIXTURE_DATE_DAY_N         → N days ago as YYYY-MM-DD
 */

export interface TemplateContext {
  userId?: string;
  userName?: string;
}

const DEFAULT_USER_ID = "mock-zoom-user-id";
const DEFAULT_USER_NAME = "Mock User";

export function applyTemplate(json: string, context: TemplateContext = {}): string {
  const userId = context.userId || DEFAULT_USER_ID;
  const userName = context.userName || DEFAULT_USER_NAME;

  let result = json;

  result = result.replaceAll("FIXTURE_ZOOM_USER_ID", userId);
  result = result.replaceAll("FIXTURE_USER_NAME", userName);

  // FIXTURE_DATE_DAY_N_TIME_H → N days ago at hour H (must be matched before the date-only pattern)
  result = result.replace(/FIXTURE_DATE_DAY_(\d+)_TIME_(\d+)/g, (_match, daysStr, hourStr) => {
    const days = parseInt(daysStr, 10);
    const hour = parseInt(hourStr, 10);
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    date.setUTCHours(hour, 0, 0, 0);
    return date.toISOString();
  });

  // FIXTURE_DATE_DAY_N → N days ago as YYYY-MM-DD
  result = result.replace(/FIXTURE_DATE_DAY_(\d+)/g, (_match, daysStr) => {
    const days = parseInt(daysStr, 10);
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().split("T")[0];
  });

  return result;
}
