import {
  ResourceLoader,
  ResourceLoaderConstructorOptions,
  FetchOptions,
  AbortablePromise,
} from 'jsdom';

export type ConfigurableResourceLoaderOptions = {
  whitelist: (string | RegExp)[];
};

export class ConfigurableResourceLoader extends ResourceLoader {
  options: ConfigurableResourceLoaderOptions;
  constructor(
    options?: /*ResourceLoaderConstructorOptions | */ ConfigurableResourceLoaderOptions
  ) {
    super();
    this.options = options ?? { whitelist: [] };
  }

  fetch(url: string, options: FetchOptions): AbortablePromise<Buffer> | null {
    if (
      this.options.whitelist.length === 0 ||
      this.options.whitelist.some((allowed) => {
        switch (typeof allowed) {
          case 'string':
            return url === allowed;
          default:
            return allowed.test(url);
        }
      })
    ) {
      return super.fetch(url, options);
    } else {
      return null;
    }
  }
}
