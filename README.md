# check-pom-uprev-action
A GitHub action that checks if the pom.xml's &lt;version> tag has been incremented

## Inputs

### `repo-token`

**Required** A GitHub token that will grant access to the repository

## Example usage

```
name: PR Check - version uprev in pom.xml

on: [pull_request]

jobs:
  pom-version-check:
    name: Verify that the version in pom.xml has been incremented
    runs-on: ubuntu-latest
    steps:
      - name: Check if the <version> has been incremented
        uses: invitation-homes/check-pom-uprev-action@v1
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

## Development

To get started
```
npm i
```

To avoid checking in `node_modules/`, you must compile the action into `dist/index.js`:
```
ncc build index.js --license licenses.txt
```

After you make a commit and push it, you also need to update and push the tag:
```
git tag -af -m "first version" v1
git push -f --tags
```
