// ADD: function to fetch only if SSR ??

// const defaultFetchData = () => Promise.resolve();
//
// function fetchDataForRoute({ routes, params }) {
//   const matchedRoute = routes[routes.length - 1];
//   const fetchDataHandler = matchedRoute.fetchData || defaultFetchData;
//   return fetchDataHandler(params);
// }

function fetchDataForRoute({ routes, params }) {
  const matchedRoute = routes[routes.length - 1]
  return matchedRoute.fetchData && matchedRoute.fetchData(params)
}

export default fetchDataForRoute
