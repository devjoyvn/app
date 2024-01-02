import {
  ResourceLoader,
  ResourceLoaderConstructorOptions,
  FetchOptions,
  AbortablePromise,
} from 'jsdom';

export type Matcher = string | RegExp;

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
    if (
      'blacklist' in this.options &&
      this.options.blacklist.some((forbidden) => this.urlMatch(url, forbidden))
    ) {
      return null;
    }

    if (
      'whitelist' in this.options &&
      (this.options.whitelist.length === 0 ||
        this.options.whitelist.some((allowed) => this.urlMatch(url, allowed)))
    ) {
      return super.fetch(url, options);
    } else {
      return null;
    }
  }

  private urlMatch(url: string, matcher: Matcher): boolean {
    switch (typeof matcher) {
      case 'string':
        return url === matcher;
      default:
        return matcher.test(url);
    }
  }
}
