/*import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
*/
/**
 * It will automatically strip the actions `type` field away before forwarding it
 * to the httpCall. This way no accidental type fields are sent anywhere.
 *
 * Example:
 *
 * ```ts
 * login$ = createEffect(() =>
 * 	httpEffect(
 * 		this.actions$,
 * 		(payload) => this.api.login(payload.username, payload.password),
 * 		login,
 * 		loginSuccess,
 * 		loginFailure
 *  )
 * )
 * ```
 * Here, `login`, `loginSuccess` and `loginFailure` are the actionCreators.
 * There are 9 generics on this function but none have to be defined because
 * everything is inferred by typescript.
 */
/*
export const httpEffect = <
	RequestPayload extends Object,
	ResponsePayload extends Object,
	FailurePayload extends Object,
	RequestActionType extends string,
	ResponseActionType extends string,
	FailureActionType extends string,
	RequestAction extends RequestPayload & TypedAction<RequestActionType> = RequestPayload &
		TypedAction<RequestActionType>,
	ResponseAction extends ResponsePayload & TypedAction<ResponseActionType> = ResponsePayload &
		TypedAction<ResponseActionType>,
	FailureAction extends FailurePayload & TypedAction<FailureActionType> = FailurePayload &
		TypedAction<FailureActionType>
>(
	actions$: Actions<RequestAction | TypedAction<string>>,
	httpCall: (
		request: Pick<RequestAction, Exclude<keyof RequestAction, 'type'>>
	) => Observable<ResponsePayload>,
	requestActionCreator: ActionCreator<RequestActionType, (p: RequestPayload) => RequestAction>,
	responseActionCreator: ActionCreator<
		ResponseActionType,
		(p: ResponsePayload) => ResponseAction
	>,
	errorActionCreator: ActionCreator<FailureActionType, (p: FailurePayload) => FailureAction>
): Observable<ResponseAction | FailureAction> => {
	return actions$.pipe(
		ofType(requestActionCreator),
		switchMap(({ type, ...rest }) =>
			httpCall(rest).pipe(
				map((response) => responseActionCreator(response)),
				catchError((error: FailurePayload) => of(errorActionCreator(error)))
			)
		)
	);
};
**/
