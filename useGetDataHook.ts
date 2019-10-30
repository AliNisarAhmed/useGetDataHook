import React from 'react';

// This custom hook tries to abstract away the React.useEffect logic from our components
// This hook is useful for fetching data, and then have that data available for further editing from inside the component (e.g. any Edit Page)

// Parameters it takes:
// 1. initial State
// 2. an Object which has apiCallFunc (function to be called to GET data), and parameter array
// 3. predicate: Only if the predicate is True or undefined, will the data be fetched from the server, else data remains equal to initial state

// returns:
// an array of two things
// 1. an object which has fetched data, isLoading and isError properties { data, isLoading(optional), isError(optional) }
// 2. the setData function: function to modify the data
// NOTE: isLoading and isError properties are optional and need not be destructured.
// NOTE: data and setData function can be renamed via destructuring to anything needed.

interface IApiObj {
	apiCallFunc: (...args: any[]) => Promise<any>;
	params: any[];
}

function useGetDataHook<T>(
	initialState: T,
	{ apiCallFunc, params }: IApiObj,
	predicate?: boolean
): [{ data: T, isLoading?: boolean, isError?: boolean }, any] {

	const [ data, setData ] = React.useState(initialState);
	const [ isLoading, setIsLoading ] = React.useState(false);
	const [ isError, setIsError ] = React.useState(false);

	React.useEffect(() => {
		let didCancel: boolean = false;
		if (predicate || typeof predicate === 'undefined') {
			try {
				fetchData();
			} catch (error) {
				setIsError(true);
			}
		}

		async function fetchData() {
			setIsLoading(true);
			const fetchedData = await apiCallFunc(...params);
			if (!didCancel) {
				setIsLoading(false);
				setData(fetchedData);
			}
		}

		return () => {
			didCancel = true;
		};
	}, []);

	return [ { data, isLoading, isError }, setData ];
}

export default useGetDataHook;