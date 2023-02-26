import { throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { checkAgainstHttpErrorFilter } from './check-against-http-error-filter.function';
import { doJwtRefresh } from './do-jwt-refresh.function';
import { intoObservable } from './into-observable.function';
export const tryJwtRefresh = (next, originalError, jwtRefreshConfiguration, refreshLock, onError, originalAction) => {
    const isRefreshAllowed = typeof originalError === 'string' ||
        checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
    if (isRefreshAllowed) {
        return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(take(1), switchMap((requestBody) => {
            if (requestBody) {
                return doJwtRefresh(next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction);
            }
            else {
                return onError(originalError);
            }
        }));
    }
    else {
        return throwError(originalError);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJ5LWp3dC1yZWZyZXNoLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi90cnktand0LXJlZnJlc2guZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUErQixVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUtqRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUN6RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTVELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxDQUM1QixJQUFpQixFQUNqQixhQUF5QyxFQUN6Qyx1QkFBMEQsRUFDMUQsV0FBcUMsRUFDckMsT0FBbUQsRUFDbkQsY0FBd0UsRUFDdEQsRUFBRTtJQUNwQixNQUFNLGdCQUFnQixHQUNyQixPQUFPLGFBQWEsS0FBSyxRQUFRO1FBQ2pDLDJCQUEyQixDQUFDLHVCQUF1QixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBRXJFLElBQUksZ0JBQWdCLEVBQUU7UUFDckIsT0FBTyxjQUFjLENBQUMsdUJBQXVCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLENBQzNFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN6QixJQUFJLFdBQVcsRUFBRTtnQkFDaEIsT0FBTyxZQUFZLENBQ2xCLElBQUksRUFDSixXQUFXLEVBQ1gsdUJBQXVCLEVBQ3ZCLFdBQVcsRUFDWCxPQUFPLEVBQ1AsY0FBYyxDQUNkLENBQUM7YUFDRjtpQkFBTTtnQkFDTixPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUM5QjtRQUNGLENBQUMsQ0FBQyxDQUNGLENBQUM7S0FDRjtTQUFNO1FBQ04sT0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDakM7QUFDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG5cdEp3dFJlZnJlc2hDb25maWd1cmF0aW9uLFxuXHRKd3RSZWZyZXNoUmVzcG9uc2UsXG59IGZyb20gJy4uL21vZGVsL2F1dGgtY29yZS1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBjaGVja0FnYWluc3RIdHRwRXJyb3JGaWx0ZXIgfSBmcm9tICcuL2NoZWNrLWFnYWluc3QtaHR0cC1lcnJvci1maWx0ZXIuZnVuY3Rpb24nO1xuaW1wb3J0IHsgZG9Kd3RSZWZyZXNoIH0gZnJvbSAnLi9kby1qd3QtcmVmcmVzaC5mdW5jdGlvbic7XG5pbXBvcnQgeyBpbnRvT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50by1vYnNlcnZhYmxlLmZ1bmN0aW9uJztcblxuZXhwb3J0IGNvbnN0IHRyeUp3dFJlZnJlc2ggPSA8UmVxLCBSZXMsIFJldD4oXG5cdG5leHQ6IEh0dHBIYW5kbGVyLFxuXHRvcmlnaW5hbEVycm9yOiBzdHJpbmcgfCBIdHRwRXJyb3JSZXNwb25zZSxcblx0and0UmVmcmVzaENvbmZpZ3VyYXRpb246IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPFJlcSwgUmVzPixcblx0cmVmcmVzaExvY2s6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPixcblx0b25FcnJvcjogKHJlZnJlc2hFcnJvcjogdW5rbm93bikgPT4gT2JzZXJ2YWJsZTxSZXQ+LFxuXHRvcmlnaW5hbEFjdGlvbjogKHJlZnJlc2hSZXNwb25zZTogSnd0UmVmcmVzaFJlc3BvbnNlKSA9PiBPYnNlcnZhYmxlPFJldD5cbik6IE9ic2VydmFibGU8UmV0PiA9PiB7XG5cdGNvbnN0IGlzUmVmcmVzaEFsbG93ZWQgPVxuXHRcdHR5cGVvZiBvcmlnaW5hbEVycm9yID09PSAnc3RyaW5nJyB8fFxuXHRcdGNoZWNrQWdhaW5zdEh0dHBFcnJvckZpbHRlcihqd3RSZWZyZXNoQ29uZmlndXJhdGlvbiwgb3JpZ2luYWxFcnJvcik7XG5cblx0aWYgKGlzUmVmcmVzaEFsbG93ZWQpIHtcblx0XHRyZXR1cm4gaW50b09ic2VydmFibGUoand0UmVmcmVzaENvbmZpZ3VyYXRpb24uY3JlYXRlUmVmcmVzaFJlcXVlc3RCb2R5KS5waXBlKFxuXHRcdFx0dGFrZSgxKSxcblx0XHRcdHN3aXRjaE1hcCgocmVxdWVzdEJvZHkpID0+IHtcblx0XHRcdFx0aWYgKHJlcXVlc3RCb2R5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRvSnd0UmVmcmVzaChcblx0XHRcdFx0XHRcdG5leHQsXG5cdFx0XHRcdFx0XHRyZXF1ZXN0Qm9keSxcblx0XHRcdFx0XHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uLFxuXHRcdFx0XHRcdFx0cmVmcmVzaExvY2ssXG5cdFx0XHRcdFx0XHRvbkVycm9yLFxuXHRcdFx0XHRcdFx0b3JpZ2luYWxBY3Rpb25cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvbkVycm9yKG9yaWdpbmFsRXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHRocm93RXJyb3Iob3JpZ2luYWxFcnJvcik7XG5cdH1cbn07XG4iXX0=