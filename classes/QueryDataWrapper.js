import _ from "lodash";
import { graphql } from "@octokit/graphql";
const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
});

export class QueryDataWrapper {
    constructor(initQuery, initResponse) {
        this.query = initQuery;
        this.results = initResponse;
        this.hasNextPage = true;
        this.endCursor = undefined;
        this.paginatedObjPath = undefined;
        this.totalCountForObjToPaginate = undefined;
        this.validQuery = undefined;
        this.errors = [];
        this.findObjectToPaginate(this.results);
        this.validateQueryForPagination();
    }

    static async query(queryString, endCursor) {
        if(endCursor === undefined) {
            return await graphqlWithAuth(queryString);
        } else {
            return await graphqlWithAuth(queryString, { endCursor: endCursor });
        }
    }

    static async paginateResults(dataWrapper) {
        while(dataWrapper.hasNextPage) {
            try {
                const paginationResults = await QueryDataWrapper.query(dataWrapper.query, dataWrapper.endCursor);
                dataWrapper.parsePaginationResponse(paginationResults);
            } catch(error) {
                dataWrapper.errors.push(error);    
                dataWrapper.hasNextPage === false;
            }
        }

        if(dataWrapper.totalCountForObjToPaginate !== _.get(dataWrapper.results, dataWrapper.paginatedObjPath).nodes.length) {
            dataWrapper.errors.push('Total records paginated does not equal total count for paginated object');
        }
    }
    
    findObjectToPaginate(objToParse, parsedObjList) {
        if(objToParse.hasOwnProperty('pageInfo')) {
            this.hasNextPage = objToParse.pageInfo.hasNextPage;
            this.endCursor = objToParse.pageInfo.endCursor;
            this.paginatedObjPath = parsedObjList;
            this.totalCountForObjToPaginate = objToParse.totalCount;
            return;
        }
    
        const childObjectsToParse = new Map();
        Object.keys(objToParse).forEach(function(key) {
            if(typeof objToParse[key] === 'object' && objToParse[key] !== null) {
                childObjectsToParse.set(key, objToParse[key])
            }
        });
    
        childObjectsToParse.forEach((childObj, key) => {
            const updatedParsedObjList = [];
            parsedObjList === undefined ? updatedParsedObjList.push(key) : updatedParsedObjList.push(...parsedObjList, key);
            this.findObjectToPaginate(childObj, updatedParsedObjList);
        });
    }

    validateQueryForPagination() {
        const variableRegEx = new RegExp(/query\(\$endCursor:\s*String/, "g");
        const cursorRegEx = new RegExp(/after:\s*\$endCursor/, "g");
        if(this.paginatedObjPath === undefined || this.totalCountForObjToPaginate === undefined) {
            this.errors.push('Query is not valid for pagination - Page Info &/or Total Count may be missing or incorrect');
            this.validQuery = false;
        } else if(this.hasNextPage === false) {
            this.validQuery = false;
        } else if(!variableRegEx.test(this.query) || !cursorRegEx.test(this.query)) {
            this.validQuery = false;
            this.errors.push('Query is not valid for pagination - Cursor variable may be missing or incorrect');
        } else {
            this.validQuery = true;
        }
    }

    parsePaginationResponse(paginationResults) {
        const paginatedResults = _.get(paginationResults, this.paginatedObjPath);
        this.hasNextPage = paginatedResults.pageInfo.hasNextPage;
        this.endCursor = paginatedResults.pageInfo.endCursor;
        _.get(this.results, this.paginatedObjPath).nodes.push(...paginatedResults.nodes);
    }
}