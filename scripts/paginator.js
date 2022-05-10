import { QueryDataWrapper } from "../classes/QueryDataWrapper.js";

export async function paginate(initQuery) {
  const res = await QueryDataWrapper.query(initQuery);
  const dataWrapper = new QueryDataWrapper(initQuery, res);
  if (dataWrapper.validQuery) await QueryDataWrapper.paginateResults(dataWrapper);
  dataWrapper.errors.forEach(error => console.error(error));
  return dataWrapper.results;
};