import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Adds a subscription object and a default OnDestroy hook to the child component
 *
 * If ngOnDestroy is is overriden in the child component don't forget to call
 * ```typescript
 * super.ngOnDestroy();
 * ```
 */
export class BaseDirective implements OnDestroy {
	protected subscriptions = new Subscription();

	/**
	 * Add the subsription to a directive wide subscription object
	 * which will be unsubscribed OnDestroy by default making
	 * all the added subscriptions unsubsribe
	 *
	 * @param subscription to be torn down on destroy
	 */
	protected set teardown(subscription: Subscription) {
		this.subscriptions.add(subscription);
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
