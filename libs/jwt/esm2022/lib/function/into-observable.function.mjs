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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50by1vYnNlcnZhYmxlLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9pbnRvLW9ic2VydmFibGUuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWhEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUM3QixRQUFpRixFQUNqRSxFQUFFO0lBQ2xCLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDNUIsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztTQUFNLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDakMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUNuQixTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxNQUFNLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDMUIsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDMUIsT0FBTyxNQUFNLENBQUM7WUFDZixDQUFDO1lBQ0QsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25CLENBQUM7UUFDRixDQUFDLENBQUMsQ0FDRixDQUFDO0lBQ0gsQ0FBQztTQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkIsQ0FBQztTQUFNLENBQUM7UUFDUCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixDQUFDO0FBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbSwgaXNPYnNlcnZhYmxlLCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vZnVuY3Rpb24ucHJlZGljYXRlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4vcHJvbWlzZS5wcmVkaWNhdGUnO1xuXG4vKipcbiAqIFJldHVybnMgYSBjb2xkIG9ic2VydmFibGUgZnJvbSBhIGZ1bmN0aW9uLCBvciByZXR1cm5zIGFuIG9ic2VydmFibGUgaWZcbiAqIG9uZSBpcyBkaXJlY3RseSBwYXNzZWQgdG8gaXRcbiAqL1xuZXhwb3J0IGNvbnN0IGludG9PYnNlcnZhYmxlID0gPFQ+KFxuXHRnZXRWYWx1ZTogVCB8IE9ic2VydmFibGU8VD4gfCBQcm9taXNlPFQ+IHwgKCgpID0+IFQgfCBQcm9taXNlPFQ+IHwgT2JzZXJ2YWJsZTxUPilcbik6IE9ic2VydmFibGU8VD4gPT4ge1xuXHRpZiAoaXNPYnNlcnZhYmxlKGdldFZhbHVlKSkge1xuXHRcdHJldHVybiBnZXRWYWx1ZTtcblx0fSBlbHNlIGlmIChpc0Z1bmN0aW9uKGdldFZhbHVlKSkge1xuXHRcdHJldHVybiBvZihudWxsKS5waXBlKFxuXHRcdFx0c3dpdGNoTWFwKCgpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gZ2V0VmFsdWUoKTtcblx0XHRcdFx0aWYgKGlzT2JzZXJ2YWJsZShyZXN1bHQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHJlc3VsdCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZnJvbShyZXN1bHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvZihyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0gZWxzZSBpZiAoaXNQcm9taXNlKGdldFZhbHVlKSkge1xuXHRcdHJldHVybiBmcm9tKGdldFZhbHVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gb2YoZ2V0VmFsdWUpO1xuXHR9XG59O1xuIl19