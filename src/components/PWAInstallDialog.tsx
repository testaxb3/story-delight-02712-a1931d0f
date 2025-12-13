import { useEffect, useRef } from 'react';
import '@khmyznikov/pwa-install';

// Declare the custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'pwa-install': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'manifest-url'?: string;
                name?: string;
                description?: string;
                icon?: string;
                'install-description'?: string;
                'manual-apple'?: string;
                'manual-chrome'?: string;
                'disable-install-description'?: string;
                'use-local-storage'?: string;
            };
        }
    }
}

interface PWAInstallProps {
    onInstallSuccess?: () => void;
    onInstallFail?: () => void;
    onInstallAvailable?: () => void;
    onUserChoice?: (choice: string) => void;
}

export function PWAInstallDialog({
    onInstallSuccess,
    onInstallFail,
    onInstallAvailable,
    onUserChoice
}: PWAInstallProps) {
    const pwaInstallRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = pwaInstallRef.current;
        if (!element) return;

        // Event handlers
        const handleSuccess = (e: CustomEvent) => {
            console.log('[PWA] Install success:', e.detail);
            onInstallSuccess?.();
        };

        const handleFail = (e: CustomEvent) => {
            console.log('[PWA] Install fail:', e.detail);
            onInstallFail?.();
        };

        const handleAvailable = (e: CustomEvent) => {
            console.log('[PWA] Install available:', e.detail);
            onInstallAvailable?.();
        };

        const handleUserChoice = (e: CustomEvent) => {
            console.log('[PWA] User choice:', e.detail);
            onUserChoice?.(e.detail?.message || 'unknown');
        };

        // Add event listeners
        element.addEventListener('pwa-install-success-event', handleSuccess as EventListener);
        element.addEventListener('pwa-install-fail-event', handleFail as EventListener);
        element.addEventListener('pwa-install-available-event', handleAvailable as EventListener);
        element.addEventListener('pwa-user-choice-result-event', handleUserChoice as EventListener);

        return () => {
            element.removeEventListener('pwa-install-success-event', handleSuccess as EventListener);
            element.removeEventListener('pwa-install-fail-event', handleFail as EventListener);
            element.removeEventListener('pwa-install-available-event', handleAvailable as EventListener);
            element.removeEventListener('pwa-user-choice-result-event', handleUserChoice as EventListener);
        };
    }, [onInstallSuccess, onInstallFail, onInstallAvailable, onUserChoice]);

    // Method to show the install dialog programmatically
    const showDialog = () => {
        const element = pwaInstallRef.current as any;
        if (element?.showDialog) {
            element.showDialog();
        }
    };

    // Method to trigger install
    const install = () => {
        const element = pwaInstallRef.current as any;
        if (element?.install) {
            element.install();
        }
    };

    return (
        <pwa-install
            ref={pwaInstallRef as any}
            manifest-url="/manifest.json"
            name="NEP System"
            description="Your parenting companion for challenging moments"
            icon="/icon-192.png"
            install-description="Install for the best experience"
        />
    );
}

// Hook to access pwa-install methods
export function usePWAInstallDialog() {
    const showDialog = () => {
        const element = document.querySelector('pwa-install') as any;
        if (element?.showDialog) {
            element.showDialog();
        }
    };

    const install = () => {
        const element = document.querySelector('pwa-install') as any;
        if (element?.install) {
            element.install();
        }
    };

    const isInstallAvailable = () => {
        const element = document.querySelector('pwa-install') as any;
        return element?.isInstallAvailable || false;
    };

    const isUnderStandaloneMode = () => {
        const element = document.querySelector('pwa-install') as any;
        return element?.isUnderStandaloneMode || false;
    };

    return {
        showDialog,
        install,
        isInstallAvailable,
        isUnderStandaloneMode,
    };
}
