# Explorer AI Project Constitution

## Project Overview

Explorer AI is a field-ready offline survival assistant powered by intelligent Q&A matching. This document establishes the foundational principles and standards for the project.

## Core Values

- **User-Centric Design**: Prioritize user safety and ease of use
- **Reliability**: Build robust systems that work offline
- **Transparency**: Clear documentation and communication
- **Quality**: Maintain high code and documentation standards
- **Accessibility**: Ensure the tool is accessible to diverse users

## Development Standards

### Code Quality
- **Python**: Follow PEP 8 style guidelines
- **Frontend**: Use semantic HTML and accessibility best practices
- **Testing**: Minimum 80% code coverage
- **Documentation**: All modules require docstrings

### Version Control
- **Branching**: Feature branches for all work
- **Commits**: Descriptive, atomic commits
- **PR Review**: All PRs require review before merge
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)

### Architecture
- **Backend**: Python HTTP server with modular utilities
- **Frontend**: HTML/CSS/JS with responsive design
- **Data**: JSON-based storage for portability
- **Deployment**: Multi-platform support (Vercel, Docker, Cloud)

## Feature Development Process

All features must follow the spec-driven development process:

1. **Specification**: Create feature spec in `specs/` directory
2. **Planning**: Define tasks and milestones
3. **Development**: Code implementation with tests
4. **Review**: Peer code review and testing
5. **Documentation**: Update relevant documentation
6. **Deployment**: Release and monitor

## Documentation Requirements

- README: Project overview and quick start
- API Documentation: All endpoints documented
- Deployment Guide: Multi-platform instructions
- Security Guide: Best practices and compliance
- Contributing Guide: How to contribute
- CHANGELOG: Version history and changes

## Quality Metrics

- **Code Coverage**: ≥ 80%
- **Type Hints**: Recommended for all Python code
- **API Responses**: Consistent JSON structure
- **Error Handling**: Graceful errors with meaningful messages
- **Performance**: API responses < 200ms for standard queries

## Review Checklist

Before merging any PR:

- [ ] Spec document created in `specs/`
- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No breaking changes or documented
- [ ] CHANGELOG updated
- [ ] At least one reviewer approval

## Future Roadmap

### Phase 1 (Current)
- Core chat functionality
- Basic location services
- Documentation and testing

### Phase 2 (Next Quarter)
- Enhanced NLP matching
- Multi-language support
- Advanced caching

### Phase 3 (Future)
- Machine learning models
- Real-time collaboration
- Advanced integrations

## Communication

- **Issues**: Use GitHub Issues for bugs and features
- **Discussions**: Use GitHub Discussions for ideas
- **Email**: support@explorer-ai.com for urgent matters
- **Documentation**: Keep docs updated with each change

## License

Explorer AI is released under the Commercial License. All contributions must comply with this license.

---

**Last Updated**: June 2026
**Maintainers**: Explorer AI Team
