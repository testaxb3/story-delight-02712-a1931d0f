// Type declarations for @khmyznikov/pwa-install web component

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
                'disable-chrome'?: string;
                'disable-close'?: string;
                'disable-install-description'?: string;
                'disable-screenshots'?: string;
                'disable-screenshots-apple'?: string;
                'disable-screenshots-chrome'?: string;
                'disable-android-fallback'?: string;
                'use-local-storage'?: string;
                styles?: string;
            };
        }
    }
}

export { };
