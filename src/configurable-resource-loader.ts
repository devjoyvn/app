import {
  ResourceLoader,
  ResourceLoaderConstructorOptions,
  FetchOptions,
  AbortablePromise,
} from 'jsdom';
import { Matcher, urlMatches } from './url-matches';

export type ConfigurableResourceLoaderOptions =
  | {
      whitelist: Matcher[];
    }
  | {
      blacklist: Matcher[];
    }
  | {
      whitelist: Matcher[];
      blacklist: Matcher[];
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
    if ('blacklist' in this.options) {
      if (
        this.options.blacklist.some((forbidden) => urlMatches(url, forbidden))
      ) {
        return null;
      }
      if (!('whitelist' in this.options)) {
        return super.fetch(url, options);
      }
    }

    if (
      'whitelist' in this.options &&
      (this.options.whitelist.length === 0 ||
        this.options.whitelist.some((allowed) => urlMatches(url, allowed)))
    ) {
      return super.fetch(url, options);
    } else {
      return null;
    }
  }
}
