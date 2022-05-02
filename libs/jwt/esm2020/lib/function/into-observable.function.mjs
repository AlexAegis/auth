import { from, isObservable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isFunction } from './function.predicate';
import { isPromise } from './promise.predicate';
/**
 * Returns a cold observable from a function, or returns an observable if
 * one is directly passed to it
 */
export const intoObservable = (getValue) => {
    if (isObservable(getValue)) {
        return getValue;
    }
    else if (isFunction(getValue)) {
        return of(null).pipe(switchMap(() => {
            const result = getValue();
            if (isObservable(result)) {
                return result;
            }
            if (isPromise(result)) {
                return from(result);
            }
            else {
                return of(result);
            }
        }));
    }
    else if (isPromise(getValue)) {
        return from(getValue);
    }
    else {
        return of(getValue);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50by1vYnNlcnZhYmxlLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9pbnRvLW9ic2VydmFibGUuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWhEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUM3QixRQUFpRixFQUNqRSxFQUFFO0lBQ2xCLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzNCLE9BQU8sUUFBUSxDQUFDO0tBQ2hCO1NBQU0sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUNuQixTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxNQUFNLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDMUIsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3pCLE9BQU8sTUFBTSxDQUFDO2FBQ2Q7WUFDRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEI7aUJBQU07Z0JBQ04sT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEI7UUFDRixDQUFDLENBQUMsQ0FDRixDQUFDO0tBQ0Y7U0FBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN0QjtTQUFNO1FBQ04sT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7QUFDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tLCBpc09ic2VydmFibGUsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9mdW5jdGlvbi5wcmVkaWNhdGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi9wcm9taXNlLnByZWRpY2F0ZSc7XG5cbi8qKlxuICogUmV0dXJucyBhIGNvbGQgb2JzZXJ2YWJsZSBmcm9tIGEgZnVuY3Rpb24sIG9yIHJldHVybnMgYW4gb2JzZXJ2YWJsZSBpZlxuICogb25lIGlzIGRpcmVjdGx5IHBhc3NlZCB0byBpdFxuICovXG5leHBvcnQgY29uc3QgaW50b09ic2VydmFibGUgPSA8VD4oXG5cdGdldFZhbHVlOiBUIHwgT2JzZXJ2YWJsZTxUPiB8IFByb21pc2U8VD4gfCAoKCkgPT4gVCB8IFByb21pc2U8VD4gfCBPYnNlcnZhYmxlPFQ+KVxuKTogT2JzZXJ2YWJsZTxUPiA9PiB7XG5cdGlmIChpc09ic2VydmFibGUoZ2V0VmFsdWUpKSB7XG5cdFx0cmV0dXJuIGdldFZhbHVlO1xuXHR9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZ2V0VmFsdWUpKSB7XG5cdFx0cmV0dXJuIG9mKG51bGwpLnBpcGUoXG5cdFx0XHRzd2l0Y2hNYXAoKCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSBnZXRWYWx1ZSgpO1xuXHRcdFx0XHRpZiAoaXNPYnNlcnZhYmxlKHJlc3VsdCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc1Byb21pc2UocmVzdWx0KSkge1xuXHRcdFx0XHRcdHJldHVybiBmcm9tKHJlc3VsdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9mKHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0KTtcblx0fSBlbHNlIGlmIChpc1Byb21pc2UoZ2V0VmFsdWUpKSB7XG5cdFx0cmV0dXJuIGZyb20oZ2V0VmFsdWUpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBvZihnZXRWYWx1ZSk7XG5cdH1cbn07XG4iXX0=