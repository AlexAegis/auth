import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorFilter } from '../model/auth-core-configuration.interface';
/**
 * Matches the filter against an error response. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export declare const checkAgainstHttpErrorFilter: (httpErrorFilter: HttpErrorFilter, error: HttpErrorResponse) => boolean;
