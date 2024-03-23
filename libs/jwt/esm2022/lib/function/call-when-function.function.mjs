import { isFunction } from './function.predicate';
export const callWhenFunction = (functionLike) => {
    let result;
    if (isFunction(functionLike)) {
        result = functionLike();
    }
    else {
        result = functionLike;
    }
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC13aGVuLWZ1bmN0aW9uLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9jYWxsLXdoZW4tZnVuY3Rpb24uZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQWMsWUFBMkIsRUFBSyxFQUFFO0lBQy9FLElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxVQUFVLENBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQztRQUNqQyxNQUFNLEdBQUcsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQztTQUFNLENBQUM7UUFDUCxNQUFNLEdBQUcsWUFBWSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9uLnByZWRpY2F0ZSc7XG5cbmV4cG9ydCBjb25zdCBjYWxsV2hlbkZ1bmN0aW9uID0gPFQgPSB1bmtub3duPihmdW5jdGlvbkxpa2U6ICgoKSA9PiBUKSB8IFQpOiBUID0+IHtcblx0bGV0IHJlc3VsdDtcblx0aWYgKGlzRnVuY3Rpb248VD4oZnVuY3Rpb25MaWtlKSkge1xuXHRcdHJlc3VsdCA9IGZ1bmN0aW9uTGlrZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9IGZ1bmN0aW9uTGlrZTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTtcbiJdfQ==