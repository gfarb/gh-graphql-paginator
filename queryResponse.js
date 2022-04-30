export const queryResponse = JSON.parse(`{
  "data": {
    "user": {
      "id": "MDQ6VXNlcjIyODI2NDE0",
      "tests": {},
      "issues": {
        "edges": [
          {
            "node": {
              "id": "MDU6SXNzdWU5Mjg0MzE2Njg=",
              "comments": {
                "edges": [
                  {
                    "cursor": "Y3Vyc29yOnYyOpHOM65oAQ==",
                    "node": {
                      "id": "MDEyOklzc3VlQ29tbWVudDg2NzA2NzkwNQ=="
                    }
                  }
                ],
                "pageInfo": {
                  "hasNextPage": false,
                  "endCursor": "Y3Vyc29yOnYyOpHOM65oAQ=="
                }
              }
            },
            "cursor": "Y3Vyc29yOnYyOpHON1a-NA=="
          },
          {
            "node": {
              "id": "I_kwDOGwHrFs5FuqnB",
              "comments": {
                "edges": [
                  {
                    "cursor": "Y3Vyc29yOnYyOpHOP6q7LQ==",
                    "node": {
                      "id": "IC_kwDOGwHrFs4_qrst"
                    }
                  }
                ],
                "pageInfo": {
                  "hasNextPage": false,
                  "endCursor": "Y3Vyc29yOnYyOpHOP6q7LQ=="
                }
              }
            },
            "cursor": "Y3Vyc29yOnYyOpHORbqpwQ=="
          },
          {
            "node": {
              "id": "I_kwDOGwHrFs5FzurT",
              "comments": {
                "edges": [],
                "pageInfo": {
                  "hasNextPage": false,
                  "endCursor": null
                }
              }
            },
            "cursor": "Y3Vyc29yOnYyOpHORc7q0w=="
          },
          {
            "node": {
              "id": "I_kwDOGwHrFs5FzvWQ",
              "comments": {
                "edges": [],
                "pageInfo": {
                  "hasNextPage": false,
                  "endCursor": null
                }
              }
            },
            "cursor": "Y3Vyc29yOnYyOpHORc71kA=="
          },
          {
            "node": {
              "id": "I_kwDOGwHrFs5Fzvq-",
              "comments": {
                "edges": [
                  {
                    "cursor": "Y3Vyc29yOnYyOpHOP7vJOA==",
                    "node": {
                      "id": "IC_kwDOGwHrFs4_u8k4"
                    }
                  }
                ],
                "pageInfo": {
                  "hasNextPage": true,
                  "endCursor": "Y3Vyc29yOnYyOpHOP7vJOA=="
                }
              }
            },
            "cursor": "Y3Vyc29yOnYyOpHORc76vg=="
          }
        ],
        "pageInfo": {
          "endCursor": "Y3Vyc29yOnYyOpHORc76vg==",
          "hasNextPage": true
        },
        "totalCount": 8
      }
    }
  }
}`);



export const initQuery = `{
  user(login: "gfarb") {
    id
    issues(states: OPEN, first: 5) {      
      edges {
        node {
          id
          comments(first: 1) {
            edges {
              cursor
              node {
                id
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
}`;