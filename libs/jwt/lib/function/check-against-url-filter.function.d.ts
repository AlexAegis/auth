import { UrlFilter } from '../model/header-configuration.interface';
import { SeparatedUrl } from './separate-url.function';
/**
 * Matches the filter against a separated url. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export declare function checkAgainstUrlFilter(urlFilter: UrlFilter, { domain, path, protocol }: SeparatedUrl): boolean;
