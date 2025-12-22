export const directions = {
    back: -1,
    next: 1,
} as const;

export type DirectionType = (typeof directions)[keyof typeof directions];
