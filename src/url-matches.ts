export type Matcher = string | RegExp;

export function urlMatches(url: string, matcher: Matcher): boolean {
  switch (typeof matcher) {
    case 'string':
      return url === matcher;
    default:
      return matcher.test(url);
  }
}
