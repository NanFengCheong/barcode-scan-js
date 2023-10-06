type BarcodeScanConfiguration = {
    codeRegex?: RegExp | null;
    minLength?: number;
    maxLength?: number;
    scanEndsWithKey?: string;
    scanTimeoutMs?: number;
    ignoreOverElements?: string[];
};
type ScanDetected = {
    code: string;
    cleanedCode: string;
    length: number;
    isValid: boolean;
    timeTakenMs: number;
    config?: BarcodeScanConfiguration;
    errorMessage?: string;
};
declare class BarcodeScanElement extends HTMLElement {
    private config;
    private inputKeys;
    private startTime;
    private timeout;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupConfig;
    private escapeRegExp;
    private onKeyDown;
    private validateInput;
}
//# sourceMappingURL=index.d.ts.map