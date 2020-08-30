/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This are some simplistic typed versions of providers. Until variadic generics
 * land, full proper typings cannot be implemented
 */
import {
	ClassSansProvider,
	ConstructorSansProvider,
	ExistingSansProvider,
	FactorySansProvider,
	InjectionToken,
	Type,
	ValueSansProvider,
} from '@angular/core';

export declare interface TypedValueProvider<T> extends TypedValueSansProvider<T> {
	provide: Type<T | T[]> | InjectionToken<T | T[]>;
	multi?: boolean;
}

export declare interface TypedValueSansProvider<T> extends ValueSansProvider {
	useValue: T;
}

export declare type TypedTypeProvider<T> = Type<T>;
export declare interface TypedClassProvider<T> extends TypedClassSansProvider<T> {
	provide: Type<T | T[]> | InjectionToken<T | T[]>;
	multi?: boolean;
}
export declare interface TypedClassSansProvider<T> extends ClassSansProvider {
	useClass: Type<T>;
}
export declare interface TypedConstructorProvider<T> extends TypedConstructorSansProvider<T> {
	provide: Type<T | T[]>;
	multi?: boolean;
}
export declare interface TypedConstructorSansProvider<T> extends ConstructorSansProvider {
	deps?: T[]; // TODO
}

export declare interface TypedExistingProvider<T> extends TypedExistingSansProvider<T> {
	provide: Type<T | T[]>;
	multi?: boolean;
}

export declare interface TypedExistingSansProvider<T> extends ExistingSansProvider {
	useExisting: InjectionToken<T | T[]>;
}

export declare interface TypedFactoryProvider<
	T,
	A = any,
	B = any,
	C = any,
	D = any,
	E = any,
	F = any,
	G = any,
	H = any,
	I = any,
	J = any,
	K = any,
	L = any,
	M = any,
	N = any,
	O = any,
	P = any,
	Q = any,
	R = any,
	S = any,
	U = any,
	V = any,
	W = any,
	X = any,
	Y = any,
	Z = any
> extends TypedFactorySansProvider<
		T,
		A,
		B,
		C,
		D,
		E,
		F,
		G,
		H,
		I,
		J,
		K,
		L,
		M,
		N,
		O,
		P,
		Q,
		R,
		S,
		U,
		V,
		W,
		X,
		Y,
		Z
	> {
	provide: Type<T | T[]>;
	multi?: boolean;
}

export declare interface TypedFactorySansProvider<
	T,
	A = any,
	B = any,
	C = any,
	D = any,
	E = any,
	F = any,
	G = any,
	H = any,
	I = any,
	J = any,
	K = any,
	L = any,
	M = any,
	N = any,
	O = any,
	P = any,
	Q = any,
	R = any,
	S = any,
	U = any,
	V = any,
	W = any,
	X = any,
	Y = any,
	Z = any
> extends FactorySansProvider {
	useFactory: (
		a: A,
		b: B,
		c: C,
		d: D,
		e: E,
		f: F,
		g: G,
		h: H,
		i: I,
		j: J,
		k: K,
		l: L,
		m: M,
		n: N,
		o: O,
		p: P,
		q: Q,
		r: R,
		s: S,
		u: U,
		v: V,
		w: W,
		x: X,
		y: Y,
		z: Z
	) => T;
	deps?: [
		Type<A>?,
		Type<B>?,
		Type<C>?,
		Type<D>?,
		Type<E>?,
		Type<F>?,
		Type<G>?,
		Type<H>?,
		Type<I>?,
		Type<J>?,
		Type<K>?,
		Type<L>?,
		Type<M>?,
		Type<N>?,
		Type<O>?,
		Type<P>?,
		Type<Q>?,
		Type<R>?,
		Type<S>?,
		Type<U>?,
		Type<V>?,
		Type<W>?,
		Type<X>?,
		Type<Y>?,
		Type<Z>?
	];
}

export declare type TypedProvider<
	T extends Record<string, any> | Type<any> | InjectionToken<any> = Record<string, any>,
	A = any,
	B = any,
	C = any,
	D = any,
	E = any,
	F = any,
	G = any,
	H = any,
	I = any,
	J = any,
	K = any,
	L = any,
	M = any,
	N = any,
	O = any,
	P = any,
	Q = any,
	R = any,
	S = any,
	U = any,
	V = any,
	W = any,
	X = any,
	Y = any,
	Z = any
> = TypedClassProvider<T> &
	TypedValueProvider<T> &
	TypedExistingProvider<T> &
	TypedFactoryProvider<
		T,
		A,
		B,
		C,
		D,
		E,
		F,
		G,
		H,
		I,
		J,
		K,
		L,
		M,
		N,
		O,
		P,
		Q,
		R,
		S,
		U,
		V,
		W,
		X,
		Y,
		Z
	>;
