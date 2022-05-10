# Simple GitHub GraphQL Paginator

Simple GitHub GraphQL Paginator is a Node.js project that uses connections and cursor-based pagination to fetch all records of an applicable object from the GitHub GraphQL API
  
## Installation

Use the Node package manager [npm](https://www.npmjs.com/) to install Simple GitHub GraphQL Paginator.

```bash
npm install gh-graphql-paginator
```

## Usage

```javascript
import { paginate } from 'gh-graphql-paginator'
const query = `
query ($endCursor: String) {
    organization(login: "github") {
      repositories(first: 100, after: $endCursor, privacy: PUBLIC) {
        nodes {
          id
          name
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

async function paginateQuery() {
    const results = await paginate(query);
    console.log(JSON.stringify(results));
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)