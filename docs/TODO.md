# Master Task List (as of 2025-12-06T16:30:21)

## High Priority / Next Up
- Real-time workout logging
- Client progress dashboard
- Attendance reports
- Multi-attendee bookings
- Verify production migrations (Cart, Multi-day, etc.)
- [x] Refactor role system (migrated from `role` column to strict `user_roles` table)
- [x] Implement Industry-Style Admin Changelog
- [x] Fix registration redirect to client profile
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

## Design Reference (Brand Colors)

### CSS HEX
--alabaster-grey: #d9d9d9ff;
--white: #fefefeff;
--pacific-cyan: #478ea0ff;
--dark-teal: #114b61ff;
--cerulean: #18809eff;
--turquoise-surf: #08acd6ff;

### CSS HSL
--alabaster-grey: hsla(0, 0%, 85%, 1);
--white: hsla(0, 0%, 100%, 1);
--pacific-cyan: hsla(192, 39%, 45%, 1);
--dark-teal: hsla(196, 70%, 22%, 1);
--cerulean: hsla(193, 74%, 36%, 1);
--turquoise-surf: hsla(192, 93%, 44%, 1);

### SCSS HEX
$alabaster-grey: #d9d9d9ff;
$white: #fefefeff;
$pacific-cyan: #478ea0ff;
$dark-teal: #114b61ff;
$cerulean: #18809eff;
$turquoise-surf: #08acd6ff;

### SCSS HSL
$alabaster-grey: hsla(0, 0%, 85%, 1);
$white: hsla(0, 0%, 100%, 1);
$pacific-cyan: hsla(192, 39%, 45%, 1);
$dark-teal: hsla(196, 70%, 22%, 1);
$cerulean: hsla(193, 74%, 36%, 1);
$turquoise-surf: hsla(192, 93%, 44%, 1);

### SCSS RGB
$alabaster-grey: rgba(217, 217, 217, 1);
$white: rgba(254, 254, 254, 1);
$pacific-cyan: rgba(71, 142, 160, 1);
$dark-teal: rgba(17, 75, 97, 1);
$cerulean: rgba(24, 128, 158, 1);
$turquoise-surf: rgba(8, 172, 214, 1);

### SCSS Gradient
$gradient-top: linear-gradient(0deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-right: linear-gradient(90deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-bottom: linear-gradient(180deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-left: linear-gradient(270deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-top-right: linear-gradient(45deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-bottom-right: linear-gradient(135deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-top-left: linear-gradient(225deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-bottom-left: linear-gradient(315deg, #d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
$gradient-radial: radial-gradient(#d9d9d9ff, #fefefeff, #478ea0ff, #114b61ff, #18809eff, #08acd6ff);
