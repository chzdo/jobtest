interface errResponseObjectType {
 success: boolean;
 message: string;
 statusCode: number;
}

interface successResponseObjectType {
 success: boolean | true;
 // eslint-disable-next-line @typescript-eslint/ban-types
 payload: Record<string, unknown> | Record<string, unknown>[] | string | Record<string, never> | object;
 statusCode: number;
}

export { errResponseObjectType, successResponseObjectType };
