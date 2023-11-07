"use strict";
class BarcodeScanElement extends HTMLElement {
    config = {
        codeRegex: null,
        minLength: 1,
        maxLength: 14,
        scanEndsWithKey: "",
        scanTimeoutMs: 3000,
        ignoreOverElements: ["INPUT"]
    };
    inputKeys = [];
    startTime = null;
    timeout = null;
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
    setupConfig() {
        const inputConfig = this.getAttribute("config");
        if (inputConfig) {
            try {
                this.config = Object.assign(this.config, JSON.parse(inputConfig));
                this.config.codeRegex = this.config.codeRegex ?? new RegExp(`^${'(.'}${this.config.minLength},${this.config.maxLength - this.config.scanEndsWithKey.length}${')'}
                    ${this.config.scanEndsWithKey}$`, 'g');
            }
            catch (error) {
                console.error("Invalid configuration:", error);
            }
        }
    }
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    onKeyDown(ev) {
        if (this.config.ignoreOverElements?.includes(ev.target.tagName)) {
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
    validateInput() {
        if (!this.startTime)
            return;
        const endTime = performance.now();
        const timeTakenMs = Math.round(endTime - this.startTime);
        const cleanedCode = this.inputKeys.filter(Boolean).filter(f => f != 'Shift' && f != 'Enter' && f != 'NumLock' && f != 'ArrowDown').join('');
        let errorMessage = '';
        switch (true) {
            case cleanedCode.length < this.config.minLength:
                errorMessage = `${cleanedCode} length is < ${this.config.minLength}`;
            case cleanedCode.length > this.config.maxLength:
                errorMessage = `${cleanedCode} length is > ${this.config.maxLength}`;
            case this.config.codeRegex.test(cleanedCode):
                errorMessage = `${cleanedCode} doesn't pass regex ${this.config.codeRegex}`;
        }
        if (!errorMessage) {
            this.dispatchEvent(new CustomEvent("scan", {
                detail: {
                    code: cleanedCode,
                    length,
                    isValid: true,
                    timeTakenMs,
                    cleanedCode,
                },
            }));
        }
        else {
            this.dispatchEvent(new CustomEvent("scan", {
                detail: {
                    code: cleanedCode,
                    length,
                    isValid: false,
                    config: this.config,
                    timeTakenMs,
                    cleanedCode,
                    errorMessage: errorMessage
                },
            }));
        }
        this.inputKeys = [];
        this.startTime = null;
    }
}
customElements.define("barcode-scan", BarcodeScanElement);
