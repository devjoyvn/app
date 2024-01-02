import { ResourceLoader, ResourceLoaderConstructorOptions  } from 'jsdom';

export type ConfigurableResourceLoaderOptions = {
    whitelist: (string|RegExp)[]
}

export class ConfigurableResourceLoader extends ResourceLoader {
    constructor(options?: /*ResourceLoaderConstructorOptions | */ConfigurableResourceLoaderOptions) {
        super();
    }
}