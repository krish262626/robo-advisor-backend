# Assessment – Design & Implementation Notes

## Approach & Thought Process
I approached this problem by first clearly understanding the core business requirement: splitting a portfolio order into stock-level orders with correct allocation, pricing, and execution timing. I intentionally focused on correctness, flexibility, and clarity of API design before optimizing for infrastructure concerns, as this was a proof-of-concept. The solution was built incrementally, validating edge cases such as weekend execution, decimal precision, and idempotency early in the design.

## Technology Choice
- Node.js with TypeScript for improved type safety, readability, and maintainability.
- Express used as a lightweight and flexible framework for REST API development.

## Order Processing Logic
- Orders can be placed on any day.
- Orders submitted on weekdays (Mon–Fri) are executed immediately.
- Orders submitted on weekends are marked as **ACCEPTED** and scheduled for execution on the next available weekday.
- Portfolio weights are validated to ensure the total allocation equals **100%**.
- Each portfolio item is assigned a unique identifier to improve traceability and understanding of order splits.
- Share quantity calculation supports **configurable decimal precision**, which can be updated dynamically via an API.
- Default stock price is set to **$100**, with an option to override it per portfolio item in the request payload.

## Data Storage
- In-memory storage is used as per assessment constraints.
- This keeps the implementation simple and focused on business logic.
- In a production environment, this can be replaced with a persistent data store.

## Assumptions
- Authentication and authorization are out of scope for this assessment.
- Single currency (USD) is assumed.
- Market holidays are not considered beyond weekends.
- Orders are processed independently without cross-order dependency.

## Idempotency & Fetch Order Handling
- Idempotency is implemented to prevent duplicate order creation.
- If the same request is submitted multiple times with the same idempotency key, the system returns the previously created response without placing a new order.
- The fetch orders API supports filtering by:
  - Idempotency key
  - Username
  - Order status
  - Stock symbol

## Production-Level Improvements
- Authentication & user context to securely associate orders with users.
- Database persistence for long-term storage and querying.
- Pagination support for fetch orders API to handle large datasets efficiently.
- Async order processing using queues or background workers.
- Enhanced monitoring, logging, and observability.

## Challenges Faced
- Handling idempotency while ensuring no duplicate orders are created.
- Managing weekend order execution by correctly calculating the next available market day.
- Maintaining flexibility for future changes such as decimal precision updates and production scalability while keeping the current implementation simple.
- Balancing completeness with scope, given the in-memory data constraint.

## Use of LLMs
LLMs were used as a productivity aid during development for:
- Validating REST API design patterns.
- Refining edge case handling and validation logic.
- Improving documentation quality for the README and answers file.
All architectural decisions and core business logic were designed and validated manually.
