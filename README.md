# Simple GitHub GraphQL Paginator
Simple GitHub GraphQL Paginator is a Node.js project that uses cursor-based pagination to paginate a GitHub GraphQL query Connection for single object.
  
## Installation
Use the Node package manager [npm](https://www.npmjs.com/package/gh-graphql-paginator) to install Simple GitHub GraphQL Paginator.

```bash
npm install gh-graphql-paginator
```

## Usage
#### Required:
- Set an environment variable called `GITHUB_TOKEN` that stores a valid GitHub PAT that will be used for GitHub GraphQL API authentication.
- The GraphQL query must include a variable called `endCursor` that is passed as the `after` argument value for the object which requires pagination. See the examples below.
- Use Connections for the object you need to paginate, do not use Edges. See the examples below.
- The Connection that requires pagination must also include `pageInfo` with `hasNextPage` and `endCursor` as well as `totalCount`. See the examples below.
- The Connection that requires pagination must be a child of a single object. For example, this project cannot paginate issues and subsequently paginate comments for every issue. This project can paginate all issues pertaining to a repository or all issue comments for an issue.

#### Examples:
_This query is fetching public repositories from the `GitHub` organization. The query will be paginated and all public repositories from the `GitHub` organization will be returned_.
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

_This query is fetching issue comments from Issue #3 in the `github/github` repo. The query will be paginated and all issue comments for the issue will be returned_.
```javascript
import { paginate } from 'gh-graphql-paginator'
const query = `
  query ($endCursor: String) {
    repository(name: "github", owner: "github") {
      issue(number: 3) {
        id
        comments(first: 1, after: $endCursor) {
          nodes {
            id
            body
          }
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
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

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Supporting Docs
- [GraphQL Pagination](https://graphql.org/learn/pagination/)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub GraphQL Variables](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#working-with-variables)
- [GitHub GraphQL Connections](https://docs.github.com/en/graphql/guides/introduction-to-graphql#connection)
