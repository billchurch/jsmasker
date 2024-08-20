# Contributing to JSMasker

First off, thank you for considering contributing to JSMasker! It's people like you that make JSMasker such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct (to be defined).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for JSMasker. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for JSMasker, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps or point out the part of JSMasker where the enhancement could be implemented.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the JavaScript styleguide (to be defined)
- Include thoughtfully-worded, well-structured tests as needed
- Document new code based on the Documentation Styleguide (to be defined)
- End all files with a newline

## Styleguides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history. Also, we use the git commit messages to generate the JSMasker change log.

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Example commit messages:

```
feat(parser): add ability to parse arrays
```

```
docs: correct spelling of CHANGELOG
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

More examples and information can be found on the [Conventional Commits website](https://www.conventionalcommits.org/).

### JavaScript Styleguide

All JavaScript must adhere to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

We use ESLint to enforce the style guide. You can run ESLint using the following command:

```
npm run lint
```

To automatically fix many linting issues, you can run:

```
npm run lint:fix
```

Our ESLint configuration extends the Airbnb base config. You can find our specific rules in the `.eslintrc.js` file at the root of the project.

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown) for documentation.
- Reference methods and classes in markdown with the custom `{}` notation:
    - Class: `{ClassName}`
    - Method: `{ClassName::methodName}`
    - Method (alternative): `{ClassName.methodName}`

## Additional Notes

### Using Standard Version

We use `standard-version` to automate versioning and CHANGELOG generation. `standard-version` uses the commit messages to determine the type of changes in the codebase. Following the Conventional Commits specification is crucial for this automation.

When you run `standard-version`, it will:
1. Bump the version in package.json based on your commits
2. Generate a changelog based on your commits
3. Create a new commit including package.json and CHANGELOG.md
4. Create a new tag with the new version number

For more details, see the [standard-version documentation](https://github.com/conventional-changelog/standard-version).


## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues for bugs in the code
* `enhancement` - Issues for new features or improvements
* `documentation` - Issues related to documentation
* `help-wanted` - Issues where we need help from the community

## Getting Started

For instructions on setting up your development environment, please see the following pages:
- [Building and Publishing](BUILD.md)
- [Webpack Integration](WEBPACK_INTEGRATION.md)

