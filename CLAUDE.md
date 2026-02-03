# CLAUDE.md - AI Assistant Guidelines for Arlecchino-Plus

This document provides essential context for AI assistants working on the Arlecchino-Plus codebase.

## Project Overview

**Arlecchino-Plus** is a restaurant management/restaurant-themed application. The project is currently in its initial setup phase.

### Current State
- **Status**: Early development (repository initialization)
- **Primary Branch**: `main` or designated feature branches
- **Repository**: Git-based version control

## Repository Structure

```
Arlecchino-Plus/
├── CLAUDE.md           # AI assistant guidelines (this file)
├── README.md           # Project description
└── [To be established] # Source code and configuration
```

### Planned Structure (To Be Implemented)
As the project develops, expect a structure similar to:
```
Arlecchino-Plus/
├── src/                # Source code
│   ├── components/     # UI components (if frontend)
│   ├── services/       # Business logic
│   ├── models/         # Data models
│   ├── utils/          # Utility functions
│   └── index.*         # Entry point
├── tests/              # Test files
├── docs/               # Documentation
├── config/             # Configuration files
├── public/             # Static assets (if web app)
├── package.json        # Dependencies (Node.js)
├── tsconfig.json       # TypeScript config (if TS)
└── README.md           # Project documentation
```

## Development Guidelines

### For AI Assistants

#### Before Making Changes
1. **Read existing code** before proposing modifications
2. **Understand the context** - check related files and dependencies
3. **Follow existing patterns** - match the code style already in use
4. **Check for tests** - ensure changes don't break existing functionality

#### Code Quality Standards
- Write clean, readable, and maintainable code
- Keep functions focused and small (single responsibility)
- Use meaningful variable and function names
- Add comments only when logic isn't self-evident
- Avoid over-engineering - implement only what's requested

#### Security Considerations
- Never hardcode secrets, API keys, or credentials
- Validate all user inputs at system boundaries
- Be aware of OWASP Top 10 vulnerabilities
- Use parameterized queries for database operations
- Sanitize outputs to prevent XSS

### Git Workflow

#### Branch Naming
- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Claude AI branches: `claude/<session-identifier>`

#### Commit Messages
Write clear, descriptive commit messages:
```
<type>: <short description>

[optional body with more details]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### Before Committing
1. Review all changes with `git diff`
2. Stage specific files (avoid `git add -A` for large changes)
3. Never commit sensitive files (.env, credentials, etc.)
4. Ensure tests pass (when test suite exists)

## Commands Reference

### Development (To Be Configured)
```bash
# Install dependencies (when package.json exists)
npm install          # or yarn install

# Start development server
npm run dev          # or yarn dev

# Run tests
npm test             # or yarn test

# Build for production
npm run build        # or yarn build

# Lint code
npm run lint         # or yarn lint
```

### Git Operations
```bash
# Check status
git status

# View changes
git diff

# Create feature branch
git checkout -b feature/<name>

# Commit changes
git add <files>
git commit -m "type: description"

# Push to remote
git push -u origin <branch-name>
```

## Coding Conventions

### General Principles
1. **Consistency** - Follow existing patterns in the codebase
2. **Simplicity** - Prefer simple solutions over complex ones
3. **Readability** - Code should be self-documenting where possible
4. **Testability** - Write code that can be easily tested

### Style Guidelines (To Be Established)
When a linter/formatter is configured, follow its rules. Until then:
- Use consistent indentation (2 or 4 spaces, match existing code)
- Use descriptive names for variables and functions
- Keep lines reasonably short (80-120 characters)
- Group related code together

### Error Handling
- Handle errors gracefully at appropriate boundaries
- Provide meaningful error messages
- Log errors with sufficient context for debugging
- Don't swallow errors silently

## Testing Guidelines

### Test Structure (When Implemented)
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests (if applicable)
```

### Testing Principles
- Write tests for new functionality
- Maintain existing test coverage
- Test edge cases and error scenarios
- Keep tests focused and independent

## Documentation

### Code Documentation
- Document public APIs and interfaces
- Add JSDoc/TSDoc comments for exported functions
- Keep README.md updated with setup instructions

### When to Document
- Complex algorithms or business logic
- Non-obvious design decisions
- API endpoints and their parameters
- Configuration options

## Dependencies

### Adding Dependencies
1. Verify the package is actively maintained
2. Check for known vulnerabilities
3. Consider bundle size impact
4. Prefer well-established packages

### Updating Dependencies
- Review changelogs before major version updates
- Run tests after updating
- Update lock files appropriately

## Environment Setup

### Prerequisites (To Be Defined)
- Node.js (version TBD)
- npm or yarn
- Git

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd Arlecchino-Plus

# Install dependencies
npm install

# Start development
npm run dev
```

## Troubleshooting

### Common Issues
1. **Dependencies not installing**: Clear node_modules and lock file, reinstall
2. **Build failures**: Check Node.js version compatibility
3. **Test failures**: Ensure test environment is properly configured

### Getting Help
- Check existing documentation
- Review similar code patterns in the codebase
- Consult project maintainers for architectural questions

## Notes for AI Assistants

### Do's
- Ask clarifying questions when requirements are ambiguous
- Break down complex tasks into smaller steps
- Verify changes work before considering complete
- Use the TodoWrite tool for multi-step tasks
- Read files before modifying them

### Don'ts
- Don't make assumptions about missing requirements
- Don't over-engineer solutions
- Don't add unnecessary dependencies
- Don't modify files outside the scope of the request
- Don't commit without explicit user approval

### When Stuck
1. Re-read the requirements carefully
2. Check for related code or patterns
3. Consider alternative approaches
4. Ask the user for clarification

---

*This document should be updated as the project evolves and conventions are established.*
