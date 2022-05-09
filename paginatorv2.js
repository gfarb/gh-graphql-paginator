import _ from "lodash";
import { graphql } from "@octokit/graphql";
import { queryResponse, initQuery } from './queryResponse.js'

const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });

class QueryDataWrapper {
    constructor(initQuery, initResponse) {
        this.query = initQuery;
        this.results = initResponse;
        this.hasNextPage = true;
        this.endCursor = undefined;
        this.paginatedObjPath = undefined;
        this.findObjectToPaginate(this.results);
    }

    static async query(queryString, endCursor) {
        if(endCursor === undefined) {
            return await graphqlWithAuth(queryString);
        } else {
            return await graphqlWithAuth(queryString, { endCursor: endCursor });
        }
    }

    static async paginate(dataWrapper) {
        while(dataWrapper.hasNextPage) {
            const paginationResults = await QueryDataWrapper.query(dataWrapper.query, dataWrapper.endCursor);
            dataWrapper.parsePaginationResponse(paginationResults);
        }
    }

    parsePaginationResponse(paginationResults) {
        const paginatedResults = _.get(paginationResults, this.paginatedObjPath);
        this.hasNextPage = paginatedResults.pageInfo.hasNextPage;
        this.endCursor = paginatedResults.pageInfo.endCursor;
        const wrappedPaginatedObjResults = _.get(this.results, this.paginatedObjPath).nodes;
        wrappedPaginatedObjResults.push(...paginatedResults.nodes);
    }
    
    findObjectToPaginate(objToParse, parsedObjList) {
        if(objToParse.hasOwnProperty('pageInfo')) {
            this.hasNextPage = objToParse.pageInfo.hasNextPage;
            this.endCursor = objToParse.pageInfo.endCursor;
            this.paginatedObjPath = parsedObjList;
            return this;
        }
    
        const childObjectsToParse = new Map();
        Object.keys(objToParse).forEach(function(key) {
            if(typeof objToParse[key] === 'object' && objToParse[key] !== null) {
                childObjectsToParse.set(key, objToParse[key])
            }
        });
    
        childObjectsToParse.forEach((childObj, key) => {
            let updatedParsedObjList = [];
            parsedObjList === undefined ? updatedParsedObjList.push(key) : updatedParsedObjList.push(...parsedObjList, key);
            this.findObjectToPaginate(childObj, updatedParsedObjList);
        });
    }
}

(async function start() {
    const res = await QueryDataWrapper.query(initQuery);
    const dataWrapper = new QueryDataWrapper(initQuery, res);
    console.log(dataWrapper.paginatedObjPath);
    console.log(dataWrapper.hasNextPage);
    console.log(dataWrapper.endCursor);
    QueryDataWrapper.paginate(dataWrapper);
})();