# Contributing

Thank you for your interest in contributing to web-midi-utils! This project is configured to use [semantic-release](https://semantic-release.gitbook.io/) for automated version management and package publishing.

## Getting Started

### Prerequisites

- Node.js 18 or higher (officially supports maintenance and active LTS versions only)
- npm

### Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for semantic versioning:

- `feat:` → Minor version bump (new feature)
- `fix:` → Patch version bump (bug fix)
- `BREAKING CHANGE:` or `feat!:` → Major version bump
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` → No version bump

Examples:
```
feat: add support for system exclusive messages
fix: correct channel nibble calculation
docs: update README with new examples
feat!: change API to use promises (BREAKING CHANGE)
```

## Local Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Check if code is formatted
npm run format:check
```

## CI/CD Setup

### GitHub Actions Configuration

The project uses GitHub Actions for continuous integration and deployment:

- **CI**: Runs on Node.js 18.x, 20.x, and 22.x (maintenance and active LTS versions)
- **Testing**: Includes linting, formatting checks, tests with coverage, and build verification
- **CD**: Automatic releases to NPM when changes are pushed to `main` branch

## Release Process

### Automatic Releases

Releases are fully automated via GitHub Actions:

1. Push commits with conventional commit messages to the `main` branch
2. GitHub Actions will automatically:
   - Run all tests and quality checks
   - Determine the next version number based on commit messages
   - Build the project
   - Publish to NPM
   - Create a GitHub release with generated release notes

## Pull Request Guidelines

1. **Fork the repository** and create your branch from `main`
2. **Add tests** for any new functionality
3. **Ensure tests pass**: Run `npm test` locally
4. **Follow code style**: Run `npm run lint` and `npm run format`
5. **Use conventional commits**: Follow the commit message format above
6. **Update documentation**: Update README.md if you change the public API
7. **Keep PRs focused**: One feature/fix per pull request

### Pull Request Process

1. Create a feature branch: `git checkout -b feat/my-new-feature`
2. Make your changes and add tests
3. Ensure all checks pass locally
4. Push to your fork and submit a pull request
5. The CI pipeline will run automatically on your PR
6. Address any feedback from maintainers
7. Once approved, your PR will be merged to `main`
8. A new release will be automatically created if your changes warrant it

## Package Configuration

The package is configured with:
- **Main entry**: `dist/index.js` (CommonJS)
- **Types**: `dist/index.d.ts` (TypeScript declarations)
- **Files included**: `dist/`, `README.md`, `LICENSE`
- **Node.js**: Requires Node.js 18 or higher (maintenance and active LTS versions only)
- **Release notes**: Generated automatically in GitHub releases (no changelog file)
- **Clean repository**: No automated commits are made during releases

### Node.js Version Policy

This project officially supports only Node.js maintenance and active LTS versions:
- **Node.js 18.x**: Maintenance LTS (supported until April 2025)
- **Node.js 20.x**: Active LTS (supported until April 2026)  
- **Node.js 22.x**: Current/Active LTS (supported until April 2027)

We do not support:
- End-of-life Node.js versions
- Odd-numbered Node.js versions (development releases)
- Pre-LTS current versions (before they become LTS)

## Troubleshooting

### NPM Publishing Issues
- Verify your NPM token has the correct permissions
- Check that the package name is available on NPM
- Ensure you're not behind a firewall blocking NPM

### GitHub Actions Issues
- Check that your repository has the correct secrets configured
- Verify the GitHub token has sufficient permissions
- Review the Actions logs for specific error messages

### Version Not Bumping
- Ensure your commit messages follow the conventional commit format
- Check that you're pushing to the `main` branch
- Verify there are semantic commits since the last release
- Check GitHub releases to see if a version was already created

### Release Notes
- Release notes are automatically generated and published to GitHub releases
- No CHANGELOG.md file is maintained in the repository
- View release history at: https://github.com/dopry/web-midi-utils/releases
