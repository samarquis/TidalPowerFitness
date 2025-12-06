# Master Task List (as of 2025-12-06)

## High Priority / Next Up
- Real-time workout logging
- Client progress dashboard
- Attendance reports
- Multi-attendee bookings
- Verify production migrations (Cart, Multi-day, etc.)
- Refactor role system (migrate from `role` column to strict `user_roles` table if needed)
- Continue security hardening (HttpOnly cookies, input validation, XSS protection)
- Complete migration to HttpOnly cookies for JWTs
- Remove redundant dependencies (e.g., bcryptjs)
- Add calendar view for classes
- Create user dashboard with motivational metrics

## Technical Debt & Maintenance
- Refactor legacy code to use centralized API client
- Add comprehensive input validation to all controller endpoints
- Improve error handling and user feedback across frontend
- Regular database backups and dependency updates
- Monitor application logs and set up secrets management

## Feature Requests & Improvements
- Expand achievements/badges system
- Enhance trainer and client dashboards
- Improve mobile UI and responsiveness
- Add more detailed analytics for workouts and classes
- Expand exercise library and categorization
- Add E2E tests for all major user flows
- Integrate Square and Acuity credentials for production
- Add custom domain support and update environment variables

## Deployment & Infrastructure
- Ensure all deployment guides are up to date
- Test Docker and Render deployments
- Set up monitoring and backups for database
- Document troubleshooting steps for common issues
