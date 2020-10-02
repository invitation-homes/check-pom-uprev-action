const core = require('@actions/core');
const github = require('@actions/github');
const parser = require('fast-xml-parser');
const compareVersions = require('compare-versions');

async function run() {
    const repoToken = core.getInput('repo-token');
    const octokit = github.getOctokit(repoToken);
    const headReq = await octokit.repos.getContent({
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name,
        path: 'pom.xml',
        ref: github.context.payload.pull_request.head.ref
      });
    const headPom = parser.parse(Buffer.from(headReq.data.content, 'base64').toString('utf-8'))
    const baseReq = await octokit.repos.getContent({
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name,
        path: 'pom.xml',
        ref: github.context.payload.pull_request.base.ref
    });
    const basePom = parser.parse(Buffer.from(baseReq.data.content, 'base64').toString('utf-8'));
    if (compareVersions(headPom.project.version, basePom.project.version) > 0) {
        console.log(`${headPom.project.version} > ${basePom.project.version}, so all good.`);
    } else {
        core.setFailed(`POM has not been incremented (${headPom.project.version} <= ${basePom.project.version})`);
    }
}

console.log(`Comparing ${github.context.payload.pull_request.head.ref} to ${github.context.payload.pull_request.base.ref}`);
run().catch(error => core.setFailed(error.message));
