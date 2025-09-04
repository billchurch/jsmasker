export type PropertyMatcher = (key: string, normalizedKey: string, value: any, path: Array<string | number>) => boolean;
export interface MaskConfig {
    properties?: string[];
    propertyMatcher?: PropertyMatcher | null;
    maskLength?: number | 'random';
    minLength?: number;
    maxLength?: number;
    maskChar?: string;
    fullMask?: boolean | string;
}
export type Masker = (data: any, config?: MaskConfig, seen?: WeakMap<any, any>) => any;
export default function maskObject(data: any, config?: MaskConfig, seen?: WeakMap<any, any>): any;
