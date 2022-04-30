import { queryResponse, initQuery } from './queryResponse.js'

class ParsedObjectWrapper {
    constructor(obj, parsedObjList, isEdgeNode) {
        this.obj = obj;
        this.parsedObjList = parsedObjList === undefined ? new ParsedObjectListWrapper() : parsedObjList;
        this.isEdgeNode = isEdgeNode === undefined ? false : isEdgeNode;
    }
}

class ParsedObjectListWrapper {
    constructor() {
        this.parsedObjList = [];
    }

    addParsedObj(key){
        this.parsedObjList.push({objName: key});
    }

    updateListForChildObj(index, key, isEdgeNode){
        if(index >= 1) this.parsedObjList.pop();
        if(isEdgeNode === false || this.parsedObjList[this.parsedObjList.length - 1].objName !== key) this.addParsedObj(key);
    }
    
    setPreviousCursor(previousCursor) {
        this.parsedObjList[this.parsedObjList.length - 2].cursor = previousCursor;
    }
}

(function start() {
    const objWrapperToParse = new ParsedObjectWrapper(queryResponse);
    parseObject(objWrapperToParse);
})();

function parseObject(objWrapperToParse) {
    const obj = objWrapperToParse.obj;
    const parsedObjList = objWrapperToParse.parsedObjList;
    const isEdgeNode = objWrapperToParse.isEdgeNode;
    const objectToPaginate = {hasEdges: false, hasPageInfo: false};
    const childObjectsToParse = new Map();

    Object.keys(obj).forEach(function(key, index) {
        switch (key) {
            case 'edges':
                objectToPaginate.hasEdges = true;
                break;
            case 'pageInfo': 
                objectToPaginate.hasPageInfo = true;
                break;
            default:
                if(typeof obj[key] === 'object' && obj[key] !== null) childObjectsToParse.set(key, obj[key]);
        }
        
        if (index != (Object.keys(obj).length - 1).toString()) return;
        if (objectToPaginate.hasPageInfo) processObjectToPaginate(new ParsedObjectWrapper(obj, parsedObjList, isEdgeNode));
        if(objectToPaginate.hasEdges) processEdgesToPaginate(new ParsedObjectWrapper(obj, parsedObjList, isEdgeNode));
    });

    let index = 0;
    childObjectsToParse.forEach((obj, key) => {
        parsedObjList.updateListForChildObj(index, key, isEdgeNode)
        parseObject(new ParsedObjectWrapper(obj, parsedObjList, isEdgeNode));
        index += 1;
    });
}

function processObjectToPaginate(objWrapperToParse) {
    const obj = objWrapperToParse.obj;
    const parsedObjList = objWrapperToParse.parsedObjList;
    console.log(`------------------------------------------------------`);
    console.log('Object to paginate...');
    console.log(obj.pageInfo.hasNextPage);
    console.log(obj.pageInfo.endCursor);
    console.log(parsedObjList);
    console.log(`------------------------------------------------------\n`);
}

function processEdgesToPaginate(objWrapperToParse) {
    const obj = objWrapperToParse.obj;
    let previousCursor = undefined;
    for(const index in obj.edges) {
        const edge = obj.edges[index];
        if(previousCursor !== undefined) objWrapperToParse.parsedObjList.setPreviousCursor(previousCursor);
        previousCursor = edge.cursor;
        parseObject(new ParsedObjectWrapper(edge.node, objWrapperToParse.parsedObjList, true));
    }
}