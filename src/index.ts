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
    config?: BarcodeScanConfiguration
    errorMessage?: string
};

class BarcodeScanElement extends HTMLElement {
    private config: BarcodeScanConfiguration = {
        codeRegex: null,
        minLength: 1,
        maxLength: 14,
        scanEndsWithKey: "",
        scanTimeoutMs: 3000,
        ignoreOverElements: ["INPUT"]
    };

    private inputKeys:string[] = [];
    private startTime: number | null = null;
    private timeout: any | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.setupConfig();
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    disconnectedCallback() {
        document.removeEventListener("keydown", this.onKeyDown.bind(this));
    }

    private setupConfig() {
        const inputConfig = this.getAttribute("config");
        if (inputConfig) {
            try {
                this.config = Object.assign(this.config, JSON.parse(inputConfig));

                this.config.codeRegex = this.config.codeRegex ?? new RegExp(
                    `^${'(.'}${this.config.minLength!},${this.config.maxLength! - this.config.scanEndsWithKey!.length}${')'}
                    ${this.config.scanEndsWithKey}$`,
                    'g'
                );
            } catch (error) {
                console.error("Invalid configuration:", error);
            }
        }
    }

    private escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    private onKeyDown(ev: KeyboardEvent) {
        if (
            this.config.ignoreOverElements?.includes(
                (ev.target as HTMLElement).tagName
            )
        ) {
            return;
        }

        if (this.startTime === null) {
            this.startTime = performance.now();
        }
        this.inputKeys.push(ev.key);
        if (ev.key === this.config.scanEndsWithKey) {
            this.validateInput();
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.validateInput();
        }, this.config.scanTimeoutMs || 1000);
    }

    private validateInput() {
        if (!this.startTime) return;
        const endTime = performance.now();
        const timeTakenMs = Math.round(endTime - this.startTime);
        const cleanedCode = this.inputKeys.filter(Boolean).filter(f => f != 'Shift' && f != 'Enter').join('')
        let errorMessage = '';
        switch (true) {
            case cleanedCode.length < this.config.minLength!:
                errorMessage = `${cleanedCode} length is < ${this.config.minLength}`
            case cleanedCode.length > this.config.maxLength!:
                errorMessage = `${cleanedCode} length is > ${this.config.maxLength}`
            case this.config.codeRegex!.test(cleanedCode):
                errorMessage = `${cleanedCode} doesn't pass regex ${this.config.codeRegex}`
        }
        if (!errorMessage) {
            this.dispatchEvent(
                new CustomEvent<ScanDetected>("scan", {
                    detail: {
                        code: cleanedCode,
                        length,
                        isValid: true,
                        timeTakenMs,
                        cleanedCode,
                    },
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent<ScanDetected>("scan", {
                    detail: {
                        code: cleanedCode,
                        length,
                        isValid: false,
                        config: this.config,
                        timeTakenMs,
                        cleanedCode,
                        errorMessage: errorMessage
                    },
                })
            );
        }

        this.inputKeys = [];
        this.startTime = null;
    }
}

customElements.define("barcode-scan", BarcodeScanElement);
