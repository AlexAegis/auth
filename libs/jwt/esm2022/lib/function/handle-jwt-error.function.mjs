import { throwError } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { handleJwtFailure } from './handle-jwt-failure.function';
import { isNotNullish } from './is-not-nullish.predicate';
export const handleJwtError = (wrappedError, jwtConfiguration, jwtRefreshConfiguration, router) => {
    const error = wrappedError.error?.error;
    if (error instanceof JwtCannotRefreshError || error instanceof JwtCouldntRefreshError) {
        if (jwtRefreshConfiguration && isNotNullish(jwtRefreshConfiguration.onFailure)) {
            // Unset accesstoken
            // jwtRefreshConfiguration.setRefreshedTokens({ accessToken: undefined });
            handleJwtFailure(jwtRefreshConfiguration.onFailure, error, router, jwtRefreshConfiguration.onFailureRedirectParameters);
        }
        // Rethrow the inner error, so observers of the user can see it
        return throwError(error);
    }
    else if (error instanceof JwtError) {
        if (isNotNullish(jwtConfiguration.onFailure)) {
            handleJwtFailure(jwtConfiguration.onFailure, error, router, jwtConfiguration.onFailureRedirectParameters);
        }
        return throwError(error);
    }
    else {
        // Other errors are left untreated
        return throwError(wrappedError);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWp3dC1lcnJvci5mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvand0L3NyYy9saWIvZnVuY3Rpb24vaGFuZGxlLWp3dC1lcnJvci5mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUtwRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFMUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQzdCLFlBTW1GLEVBQ25GLGdCQUFrQyxFQUNsQyx1QkFBa0YsRUFDbEYsTUFBZSxFQUNLLEVBQUU7SUFDdEIsTUFBTSxLQUFLLEdBQ1YsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7SUFFM0IsSUFBSSxLQUFLLFlBQVkscUJBQXFCLElBQUksS0FBSyxZQUFZLHNCQUFzQixFQUFFLENBQUM7UUFDdkYsSUFBSSx1QkFBdUIsSUFBSSxZQUFZLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUNoRixvQkFBb0I7WUFDcEIsMEVBQTBFO1lBRTFFLGdCQUFnQixDQUNmLHVCQUF1QixDQUFDLFNBQVMsRUFDakMsS0FBSyxFQUNMLE1BQU0sRUFDTix1QkFBdUIsQ0FBQywyQkFBMkIsQ0FDbkQsQ0FBQztRQUNILENBQUM7UUFDRCwrREFBK0Q7UUFDL0QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztTQUFNLElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLElBQUksWUFBWSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDOUMsZ0JBQWdCLENBQ2YsZ0JBQWdCLENBQUMsU0FBUyxFQUMxQixLQUFLLEVBQ0wsTUFBTSxFQUNOLGdCQUFnQixDQUFDLDJCQUEyQixDQUM1QyxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7U0FBTSxDQUFDO1FBQ1Asa0NBQWtDO1FBQ2xDLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7QUFDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKd3RDYW5ub3RSZWZyZXNoRXJyb3IsIEp3dENvdWxkbnRSZWZyZXNoRXJyb3IsIEp3dEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL2p3dC1lcnJvci5jbGFzcyc7XG5pbXBvcnQge1xuXHRKd3RDb25maWd1cmF0aW9uLFxuXHRKd3RSZWZyZXNoQ29uZmlndXJhdGlvbixcbn0gZnJvbSAnLi4vbW9kZWwvYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IGhhbmRsZUp3dEZhaWx1cmUgfSBmcm9tICcuL2hhbmRsZS1qd3QtZmFpbHVyZS5mdW5jdGlvbic7XG5pbXBvcnQgeyBpc05vdE51bGxpc2ggfSBmcm9tICcuL2lzLW5vdC1udWxsaXNoLnByZWRpY2F0ZSc7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVKd3RFcnJvciA9IDxSZWZyZXNoUmVxdWVzdCA9IHVua25vd24sIFJlZnJlc2hSZXNwb25zZSA9IHVua25vd24+KFxuXHR3cmFwcGVkRXJyb3I6XG5cdFx0fCAoT21pdDxIdHRwRXJyb3JSZXNwb25zZSwgJ2Vycm9yJz4gJiB7XG5cdFx0XHRcdGVycm9yPzogT21pdDxFcnJvckV2ZW50LCAnZXJyb3InPiAmIHtcblx0XHRcdFx0XHRlcnJvcjogSnd0RXJyb3IgfCBKd3RDYW5ub3RSZWZyZXNoRXJyb3IgfCBKd3RDb3VsZG50UmVmcmVzaEVycm9yO1xuXHRcdFx0XHR9O1xuXHRcdCAgfSlcblx0XHR8IHsgZXJyb3I/OiB7IGVycm9yOiBKd3RFcnJvciB8IEp3dENhbm5vdFJlZnJlc2hFcnJvciB8IEp3dENvdWxkbnRSZWZyZXNoRXJyb3IgfSB9LFxuXHRqd3RDb25maWd1cmF0aW9uOiBKd3RDb25maWd1cmF0aW9uLFxuXHRqd3RSZWZyZXNoQ29uZmlndXJhdGlvbj86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+LFxuXHRyb3V0ZXI/OiBSb3V0ZXIsXG4pOiBPYnNlcnZhYmxlPG5ldmVyPiA9PiB7XG5cdGNvbnN0IGVycm9yOiB1bmRlZmluZWQgfCBKd3RFcnJvciB8IEp3dENhbm5vdFJlZnJlc2hFcnJvciB8IEp3dENvdWxkbnRSZWZyZXNoRXJyb3IgPVxuXHRcdHdyYXBwZWRFcnJvci5lcnJvcj8uZXJyb3I7XG5cblx0aWYgKGVycm9yIGluc3RhbmNlb2YgSnd0Q2Fubm90UmVmcmVzaEVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgSnd0Q291bGRudFJlZnJlc2hFcnJvcikge1xuXHRcdGlmIChqd3RSZWZyZXNoQ29uZmlndXJhdGlvbiAmJiBpc05vdE51bGxpc2goand0UmVmcmVzaENvbmZpZ3VyYXRpb24ub25GYWlsdXJlKSkge1xuXHRcdFx0Ly8gVW5zZXQgYWNjZXNzdG9rZW5cblx0XHRcdC8vIGp3dFJlZnJlc2hDb25maWd1cmF0aW9uLnNldFJlZnJlc2hlZFRva2Vucyh7IGFjY2Vzc1Rva2VuOiB1bmRlZmluZWQgfSk7XG5cblx0XHRcdGhhbmRsZUp3dEZhaWx1cmUoXG5cdFx0XHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uLm9uRmFpbHVyZSxcblx0XHRcdFx0ZXJyb3IsXG5cdFx0XHRcdHJvdXRlcixcblx0XHRcdFx0and0UmVmcmVzaENvbmZpZ3VyYXRpb24ub25GYWlsdXJlUmVkaXJlY3RQYXJhbWV0ZXJzLFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0Ly8gUmV0aHJvdyB0aGUgaW5uZXIgZXJyb3IsIHNvIG9ic2VydmVycyBvZiB0aGUgdXNlciBjYW4gc2VlIGl0XG5cdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHR9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgSnd0RXJyb3IpIHtcblx0XHRpZiAoaXNOb3ROdWxsaXNoKGp3dENvbmZpZ3VyYXRpb24ub25GYWlsdXJlKSkge1xuXHRcdFx0aGFuZGxlSnd0RmFpbHVyZShcblx0XHRcdFx0and0Q29uZmlndXJhdGlvbi5vbkZhaWx1cmUsXG5cdFx0XHRcdGVycm9yLFxuXHRcdFx0XHRyb3V0ZXIsXG5cdFx0XHRcdGp3dENvbmZpZ3VyYXRpb24ub25GYWlsdXJlUmVkaXJlY3RQYXJhbWV0ZXJzLFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIE90aGVyIGVycm9ycyBhcmUgbGVmdCB1bnRyZWF0ZWRcblx0XHRyZXR1cm4gdGhyb3dFcnJvcih3cmFwcGVkRXJyb3IpO1xuXHR9XG59O1xuIl19