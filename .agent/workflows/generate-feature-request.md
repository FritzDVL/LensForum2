---
description: Generate a Feature Requirement Document (FRED) for a new feature request.
---

# Feature Requirement Document Generation Rule

## When to Apply This Rule:

This workflow applies **ONLY** when the user requests implementation of a **new feature** or **new functionality**. Apply this rule when you detect:

- Requests to implement, add, create, or build new features
- Requests for new functionality that doesn't exist yet
- Feature requests that require planning and documentation

**Do NOT apply this rule for:**

- Bug fixes or debugging
- Refactoring existing code
- Code reviews or explanations
- Modifications to existing features (unless explicitly a new feature)
- Questions or documentation requests

## When a new feature implementation is requested:

1. **ALWAYS generate a Feature Requirement Document (FRED) FIRST** before starting any implementation work.

2. **FRED Generation Process**:
   - Use the template structure from `docs/fred-template.md` as the base format.
   - Follow the formatting style used in existing documents in `docs/features/` (markdown with bold headers, bullet points, etc.).
   - Generate a comprehensive document covering all template sections:
     - Feature Name
     - Goal
     - User Story
     - Functional Requirements
     - Data Requirements (if applicable)
     - User Flow
     - Acceptance Criteria
     - Edge Cases
     - Non-Functional Requirements (if applicable)

3. **File Naming**:
   - Save the FRED in `docs/features/` directory.
   - Use kebab-case for the filename based on the feature name.
   - Example: "User Authentication" → `user-authentication.md`
   - Example: "Campaign Generation" → `campaign-generation.md`

4. **FRED Content Requirements**:
   - Be specific and detailed in all sections.
   - Functional Requirements should be measurable and testable.
   - User Flow should include step-by-step actions.
   - Acceptance Criteria must be clear and verifiable.
   - Consider edge cases and error scenarios.
   - Include data requirements if the feature involves database changes.

5. **After FRED Generation**:
   - Present the FRED to the user for review.
   - Wait for confirmation or feedback before proceeding with implementation.
   - Only start implementation after the FRED is approved or finalized.

6. **Exception**: If the user explicitly states "skip FRED" or "implement directly", you may proceed without generating the document, but this should be rare.
