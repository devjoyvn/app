export type Matcher = string | RegExp;

export function urlMatches(url: string, matcher: Matcher): boolean {
  switch (typeof matcher) {
    case 'string':
      if (matcher === '') {
        throw new Error(
          `Invalid matcher: Tried to match '${url}' against a blank string.`
        );
      }
      return url === matcher;
    default:
      return matcher.test(url);
  }
}
