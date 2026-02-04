
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface GrowthStatistics {
    growthRate: number;
    formattedGrowthRate: string;
    isIncrease: boolean;
}

/**
 * Calculates the percentage growth rate between two numbers.
 * @param current The value for the current period.
 * @param previous The value for the previous period.
 * @returns An object containing the raw growth rate, formatted string, and increase status.
 */
export function calculateGrowthRate(
    current: number,
    previous: number,
): GrowthStatistics {
    const growthRate =
        previous === 0
            ? current === 0
                ? 0
                : 100
            : ((current - previous) / previous) * 100;

    return {
        growthRate,
        formattedGrowthRate: Math.round(growthRate * 100) / 100 + '%',
        isIncrease: growthRate >= 0,
    };
}

/**
 * Returns the start and end dates for the current month and the previous month.
 * Useful for querying database records for comparison.
 */
export function getMonthComparisonRanges() {
    const now = new Date();

    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    return {
        currentString: {
            start: currentMonthStart,
            end: currentMonthEnd,
        },
        lastString: {
            start: lastMonthStart,
            end: lastMonthEnd,
        },
        // Also return simpler named properties if preferred
        currentMonthStart,
        currentMonthEnd,
        lastMonthStart,
        lastMonthEnd,
    };
}
