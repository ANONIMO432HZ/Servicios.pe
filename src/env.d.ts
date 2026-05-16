/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_MODE: 'real' | 'mock';
  readonly API_PROVIDER: 'json_pe' | 'eldni';
  readonly JSON_PE_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
