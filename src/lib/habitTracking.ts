export const MALAYSIA_TIMEZONE = "Asia/Kuala_Lumpur";

export type HabitInputType = "boolean" | "number" | "time";
export type HabitTimeMode = "clock" | "sleep";
export type HabitEntryType = "boolean" | "number" | "time";

function pad2(value: number) {
    return String(value).padStart(2, "0");
}

export function getMalaysiaDateParts(baseDate = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: MALAYSIA_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(baseDate);

    const year = Number(parts.find((part) => part.type === "year")?.value || "0");
    const month = Number(parts.find((part) => part.type === "month")?.value || "1");
    const day = Number(parts.find((part) => part.type === "day")?.value || "1");

    return { year, month, day };
}

export function getMalaysiaTodayStr(baseDate = new Date()) {
    const { year, month, day } = getMalaysiaDateParts(baseDate);
    return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function parseDateStrAsUTC(dateText: string) {
    const [year, month, day] = dateText.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

export function formatUTCDate(date: Date) {
    return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

export function getWeekStartMonday(dateText: string) {
    const date = parseDateStrAsUTC(dateText);
    const dayOfWeek = date.getUTCDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    date.setUTCDate(date.getUTCDate() - daysSinceMonday);
    return formatUTCDate(date);
}

export function getInclusiveDayCount(startDateText: string, endDateText: string) {
    const start = parseDateStrAsUTC(startDateText);
    const end = parseDateStrAsUTC(endDateText);
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(1, diffDays + 1);
}

export function getHabitInputType(inputType: string | null | undefined): HabitInputType {
    if (inputType === "number" || inputType === "time") return inputType;
    return "boolean";
}

export function getHabitTimeMode(timeMode: string | null | undefined): HabitTimeMode {
    return timeMode === "sleep" ? "sleep" : "clock";
}

export function parseTimeInputToMinutes(value: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) return null;
    const [hh, mm] = value.split(":").map(Number);
    if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
        return null;
    }
    return hh * 60 + mm;
}

export function formatMinutesForInput(totalMinutes: number) {
    const safe = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hh = Math.floor(safe / 60);
    const mm = safe % 60;
    return `${pad2(hh)}:${pad2(mm)}`;
}

export function formatMinutes12Hour(totalMinutes: number) {
    const safe = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hh = Math.floor(safe / 60);
    const mm = safe % 60;
    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 || 12;
    return `${hour12}:${pad2(mm)} ${period}`;
}

export function averageTimeMinutes(minutes: number[], useSleepWrap: boolean) {
    if (minutes.length === 0) return null;

    const adjusted = minutes.map((minute) => {
        if (useSleepWrap && minute < 6 * 60) {
            return minute + 24 * 60;
        }
        return minute;
    });

    const avg = Math.round(adjusted.reduce((sum, minute) => sum + minute, 0) / adjusted.length);
    return ((avg % 1440) + 1440) % 1440;
}

export function clampPercent(value: number) {
    return Math.max(0, Math.min(100, value));
}

export function formatNumberValue(value: number) {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(2).replace(/\.?0+$/, "");
}

