Annotations
1 error and 1 warning
lint-and-test (20)
failed 5 minutes ago in 49s
Search logs
1s
25s
0s
4s
4s
2s
11s
Run npm test

> hire-dey-go-be@1.0.0 test
> cross-env NODE_ENV=test node --test ./tests/*.test.js ./tests/unit/*.test.js ./tests/integration/*.test.js

TAP version 13
# Subtest: Health check
    # Subtest: should confirm the project loads without errors
    ok 1 - should confirm the project loads without errors
      ---
      duration_ms: 1.145712
      ...
    # Subtest: should have required environment expectations
    ok 2 - should have required environment expectations
      ---
      duration_ms: 0.239778
      ...
    1..2
ok 1 - Health check
  ---
  duration_ms: 2.837555
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
# MongoDB connected: localhost
# Subtest: Application Endpoints Integration
    # Subtest: GET /api/v1/applications/job/:jobId should return applications for recruiter
    not ok 1 - GET /api/v1/applications/job/:jobId should return applications for recruiter
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:86:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/applications/job/:jobId should block candidate role
    not ok 2 - GET /api/v1/applications/job/:jobId should block candidate role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:97:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/applications/job/:jobId should return 400 for invalid jobId
    not ok 3 - GET /api/v1/applications/job/:jobId should return 400 for invalid jobId
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:106:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: PATCH /api/v1/applications/:id/status should update status for recruiter
    not ok 4 - PATCH /api/v1/applications/:id/status should update status for recruiter
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:115:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: PATCH /api/v1/applications/:id/status should fail with invalid status
    not ok 5 - PATCH /api/v1/applications/:id/status should fail with invalid status
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:126:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: PATCH /api/v1/applications/:id/status should block candidate role
    not ok 6 - PATCH /api/v1/applications/:id/status should block candidate role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:136:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: PATCH /api/v1/applications/:id/status should return 401 without token
    not ok 7 - PATCH /api/v1/applications/:id/status should return 401 without token
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:146:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    1..7
not ok 2 - Application Endpoints Integration
  ---
  duration_ms: 1081.093798
  type: 'suite'
  location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:17:1'
  failureType: 'hookFailed'
  error: 'Job validation failed: description: Description must be at least 50 characters'
  code: 'ERR_TEST_FAILURE'
  name: 'ValidationError'
  stack: |-
    model.validate (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/document.js:2864:36)
    process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    async model.$__save (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:390:7)
    async model.save (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:664:5)
    async Function.create (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:2751:5)
    async SuiteContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/application.integration.test.js:58:11)
    async TestHook.run (node:internal/test_runner/test:797:9)
    async Suite.runHook (node:internal/test_runner/test:723:9)
    async Suite.run (node:internal/test_runner/test:1129:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:526:7)
  ...
# Subtest: Assessment Endpoints Integration
    # Subtest: add assessment integration tests for create/submit/result flows
    ok 1 - add assessment integration tests for create/submit/result flows # TODO
      ---
      duration_ms: 1.228427
      ...
    1..1
ok 3 - Assessment Endpoints Integration
  ---
  duration_ms: 2.87712
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
# MongoDB connected: localhost
# METHOD: POST
# URL: /api/v1/auth/register
# BODY: {
#   firstName: 'Test',
#   lastName: 'User',
#   email: 'test-1774022007928@example.com',
#   password: 'testPassword123',
#   role: 'CANDIDATE'
# }
# 📧 [DEV] Email captured:
#    To: test-1774022007928@example.com
#    Subject: Verify your email – Hire Dey Go
#    From: onboarding@resend.dev
#    OTP: 269934
# Subtest: Auth Endpoints Integration
    # Subtest: POST /api/v1/auth/register should create a new user
    ok 1 - POST /api/v1/auth/register should create a new user
      ---
      duration_ms: 703.381568
      ...
# METHOD: POST
# URL: /api/v1/auth/login
# BODY: {
#   email: 'test-1774022007928@example.com',
#   password: 'testPassword123'
# }
    # Subtest: POST /api/v1/auth/login should authenticate user and return tokens
    ok 2 - POST /api/v1/auth/login should authenticate user and return tokens
      ---
      duration_ms: 426.632035
      ...
# METHOD: POST
# URL: /api/v1/auth/login
# BODY: { email: 'test-1774022007928@example.com', password: 'wrongPassword' }
    # Subtest: POST /api/v1/auth/login should fail with invalid credentials
    ok 3 - POST /api/v1/auth/login should fail with invalid credentials
      ---
      duration_ms: 335.531979
      ...
# METHOD: POST
# URL: /api/v1/auth/resend-otp
# BODY: { email: 'test-1774022007928@example.com' }
    # Subtest: POST /api/v1/auth/resend-otp should fail if email already verified
    ok 4 - POST /api/v1/auth/resend-otp should fail if email already verified
      ---
      duration_ms: 6.579602
      ...
# METHOD: POST
# URL: /api/v1/auth/resend-otp
# BODY: { email: 'nonexistent@example.com' }
    # Subtest: POST /api/v1/auth/resend-otp should fail for non-existent email
    ok 5 - POST /api/v1/auth/resend-otp should fail for non-existent email
      ---
      duration_ms: 4.554326
      ...
# METHOD: POST
# URL: /api/v1/auth/logout
# BODY: undefined
    # Subtest: POST /api/v1/auth/logout should logout successfully
    ok 6 - POST /api/v1/auth/logout should logout successfully
      ---
      duration_ms: 7.594138
      ...
# METHOD: POST
# URL: /api/v1/auth/logout
# BODY: undefined
    # Subtest: POST /api/v1/auth/logout should fail without token
    ok 7 - POST /api/v1/auth/logout should fail without token
      ---
      duration_ms: 2.833818
      ...
    1..7
ok 4 - Auth Endpoints Integration
  ---
  duration_ms: 1579.182763
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
# MongoDB connected: localhost
# Subtest: Bookmark Endpoints Integration
    # Subtest: POST /api/v1/bookmarks/jobs/:jobId should bookmark a job for candidate
    not ok 1 - POST /api/v1/bookmarks/jobs/:jobId should bookmark a job for candidate
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:89:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/jobs/:jobId should remove bookmark on second call (toggle)
    not ok 2 - POST /api/v1/bookmarks/jobs/:jobId should remove bookmark on second call (toggle)
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:100:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/jobs/:jobId should return 403 for recruiter role
    not ok 3 - POST /api/v1/bookmarks/jobs/:jobId should return 403 for recruiter role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:111:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/jobs/:jobId should return 404 for non-existent job
    not ok 4 - POST /api/v1/bookmarks/jobs/:jobId should return 404 for non-existent job
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:120:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/jobs/:jobId should return 401 without token
    not ok 5 - POST /api/v1/bookmarks/jobs/:jobId should return 401 without token
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:130:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/jobs should return bookmarked jobs for candidate
    not ok 6 - GET /api/v1/bookmarks/jobs should return bookmarked jobs for candidate
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:138:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/jobs should return 403 for recruiter role
    not ok 7 - GET /api/v1/bookmarks/jobs should return 403 for recruiter role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:155:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/companies/:companyId should bookmark a company for candidate
    not ok 8 - POST /api/v1/bookmarks/companies/:companyId should bookmark a company for candidate
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:166:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/companies/:companyId should toggle off on second call
    not ok 9 - POST /api/v1/bookmarks/companies/:companyId should toggle off on second call
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:177:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/companies/:companyId should return 404 for non-existent company
    not ok 10 - POST /api/v1/bookmarks/companies/:companyId should return 404 for non-existent company
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:187:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/companies should return bookmarked companies for candidate
    not ok 11 - GET /api/v1/bookmarks/companies should return bookmarked companies for candidate
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:197:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/companies should return 403 for recruiter role
    not ok 12 - GET /api/v1/bookmarks/companies should return 403 for recruiter role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:214:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/candidates/:candidateId should bookmark a candidate for recruiter
    not ok 13 - POST /api/v1/bookmarks/candidates/:candidateId should bookmark a candidate for recruiter
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:225:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/candidates/:candidateId should toggle off on second call
    not ok 14 - POST /api/v1/bookmarks/candidates/:candidateId should toggle off on second call
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:236:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/candidates/:candidateId should return 403 for candidate role
    not ok 15 - POST /api/v1/bookmarks/candidates/:candidateId should return 403 for candidate role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:246:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: POST /api/v1/bookmarks/candidates/:candidateId should return 404 for non-candidate user
    not ok 16 - POST /api/v1/bookmarks/candidates/:candidateId should return 404 for non-candidate user
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:255:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/candidates should return bookmarked candidates for recruiter
    not ok 17 - GET /api/v1/bookmarks/candidates should return bookmarked candidates for recruiter
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:266:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/candidates should return 403 for candidate role
    not ok 18 - GET /api/v1/bookmarks/candidates should return 403 for candidate role
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:283:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    # Subtest: GET /api/v1/bookmarks/candidates should return 401 without token
    not ok 19 - GET /api/v1/bookmarks/candidates should return 401 without token
      ---
      duration_ms: 0
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:292:3'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    1..19
not ok 5 - Bookmark Endpoints Integration
  ---
  duration_ms: 1151.226854
  type: 'suite'
  location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:16:1'
  failureType: 'hookFailed'
  error: 'Job validation failed: description: Description must be at least 50 characters'
  code: 'ERR_TEST_FAILURE'
  name: 'ValidationError'
  stack: |-
    model.validate (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/document.js:2864:36)
    process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    async model.$__save (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:390:7)
    async model.save (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:664:5)
    async Function.create (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/mongoose/lib/model.js:2751:5)
    async SuiteContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/bookmark.integration.test.js:63:11)
    async TestHook.run (node:internal/test_runner/test:797:9)
    async Suite.runHook (node:internal/test_runner/test:723:9)
    async Suite.run (node:internal/test_runner/test:1129:7)
    async Test.processPendingSubtests (node:internal/test_runner/test:526:7)
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
# MongoDB connected: localhost
# METHOD: POST
# URL: /api/v1/companies
# BODY: {
#   name: 'Test Company 1774022010575',
#   about: 'A leading technology company building innovative solutions',
#   description: 'A test company',
#   industry: 'Technology',
#   teamSize: '11-50',
#   organizationType: 'STARTUP',
#   yearEstablished: 2015,
#   location: 'Lagos, Nigeria',
#   country: 'Nigeria',
#   city: 'Lagos',
#   address: '123 Victoria Island, Lagos',
#   website: 'https://testcompany.com',
#   workEmail: 'hello@testcompany.com',
#   phone: '+2348012345678',
#   socialLinks: {
#     linkedin: 'https://linkedin.com/company/testcompany',
#     twitter: 'https://twitter.com/testcompany'
#   }
# }
# Subtest: Company Endpoints Integration
    # Subtest: POST /api/v1/companies should create a company for recruiter
    not ok 1 - POST /api/v1/companies should create a company for recruiter
      ---
      duration_ms: 58.574388
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:87:3'
      failureType: 'testCodeFailure'
      error: |-
        Expected values to be strictly equal:
        
        400 !== 201
        
      code: 'ERR_ASSERTION'
      name: 'AssertionError'
      expected: 201
      actual: 400
      operator: 'strictEqual'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:112:12)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Test.run (node:internal/test_runner/test:797:9)
        async Promise.all (index 0)
        async Suite.run (node:internal/test_runner/test:1135:7)
        async Test.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
# METHOD: POST
# URL: /api/v1/companies
# BODY: { name: 'Candidate Company' }
    # Subtest: POST /api/v1/companies should block candidate role
    ok 2 - POST /api/v1/companies should block candidate role
      ---
      duration_ms: 6.666351
      ...
# METHOD: POST
# URL: /api/v1/companies
# BODY: { name: 'No Token Company' }
    # Subtest: POST /api/v1/companies should return 401 without token
    ok 3 - POST /api/v1/companies should return 401 without token
      ---
      duration_ms: 3.912405
      ...
# METHOD: POST
# URL: /api/v1/companies
# BODY: { description: 'No name provided' }
    # Subtest: POST /api/v1/companies should return 400 when name is missing
    ok 4 - POST /api/v1/companies should return 400 when name is missing
      ---
      duration_ms: 4.837545
      ...
# METHOD: POST
# URL: /api/v1/companies
# BODY: { name: 'Duplicate Company' }
    # Subtest: POST /api/v1/companies should return 409 if recruiter already has a company
    not ok 5 - POST /api/v1/companies should return 409 if recruiter already has a company
      ---
      duration_ms: 16.769384
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:149:3'
      failureType: 'testCodeFailure'
      error: |-
        Expected values to be strictly equal:
        
        201 !== 409
        
      code: 'ERR_ASSERTION'
      name: 'AssertionError'
      expected: 409
      actual: 201
      operator: 'strictEqual'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:155:12)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Test.run (node:internal/test_runner/test:797:9)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
# METHOD: GET
# URL: /api/v1/companies/me
# BODY: undefined
    # Subtest: GET /api/v1/companies/me should return recruiter's own company
    not ok 6 - GET /api/v1/companies/me should return recruiter's own company
      ---
      duration_ms: 9.497287
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:161:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:168:56)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Test.run (node:internal/test_runner/test:797:9)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
# METHOD: GET
# URL: /api/v1/companies/me
# BODY: undefined
# { statusCode: 404, message: 'You do not have a company profile yet' } Error: You do not have a company profile yet
#     at Module.getMyCompany (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.service.js:36:17)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.controller.js:21:19 {
#   statusCode: 404
# }
    # Subtest: GET /api/v1/companies/me should return 404 if recruiter has no company
    ok 7 - GET /api/v1/companies/me should return 404 if recruiter has no company
      ---
      duration_ms: 10.676963
      ...
    # Subtest: GET /api/v1/companies/:id should return company publicly
    not ok 8 - GET /api/v1/companies/:id should return company publicly
      ---
      duration_ms: 0.422069
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:180:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:182:41)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
# { statusCode: 404, message: 'Company not found' } Error: Company not found
#     at Module.getCompanyById (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.service.js:25:17)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.controller.js:27:19 {
#   statusCode: 404
# }
# METHOD: GET
# URL: /api/v1/companies/69bd6d7cdfe7d11d47cc097f
# BODY: undefined
    # Subtest: GET /api/v1/companies/:id should return 404 for non-existent company
    ok 9 - GET /api/v1/companies/:id should return 404 for non-existent company
      ---
      duration_ms: 11.832394
      ...
    # Subtest: PATCH /api/v1/companies/:id should update company for owner
    not ok 10 - PATCH /api/v1/companies/:id should update company for owner
      ---
      duration_ms: 0.413282
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:200:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:202:43)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    # Subtest: PATCH /api/v1/companies/:id should return 403 for non-owner recruiter
    not ok 11 - PATCH /api/v1/companies/:id should return 403 for non-owner recruiter
      ---
      duration_ms: 0.300132
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:217:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:219:43)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    # Subtest: PATCH /api/v1/companies/:id should return 400 for empty update body
    not ok 12 - PATCH /api/v1/companies/:id should return 400 for empty update body
      ---
      duration_ms: 0.394127
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:227:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:229:43)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    # Subtest: GET /api/v1/companies/:id/jobs should return jobs for a company
    not ok 13 - GET /api/v1/companies/:id/jobs should return jobs for a company
      ---
      duration_ms: 0.349253
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:239:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:241:26)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
# METHOD: GET
# URL: /api/v1/companies/69bd6d7cdfe7d11d47cc0981/jobs
# BODY: undefined
# { statusCode: 404, message: 'Company not found' } Error: Company not found
#     at Module.getJobsByCompany (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.service.js:121:17)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/company/company.controller.js:69:18 {
#   statusCode: 404
# }
    # Subtest: GET /api/v1/companies/:id/jobs should return 404 for non-existent company
    ok 14 - GET /api/v1/companies/:id/jobs should return 404 for non-existent company
      ---
      duration_ms: 8.994327
      ...
    # Subtest: DELETE /api/v1/companies/:id should return 403 for non-owner
    not ok 15 - DELETE /api/v1/companies/:id should return 403 for non-owner
      ---
      duration_ms: 0.34213
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:269:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:271:44)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    # Subtest: DELETE /api/v1/companies/:id should delete company for owner
    not ok 16 - DELETE /api/v1/companies/:id should delete company for owner
      ---
      duration_ms: 0.336039
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:278:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:280:44)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    # Subtest: GET /api/v1/companies/:id should return 404 after deletion
    not ok 17 - GET /api/v1/companies/:id should return 404 after deletion
      ---
      duration_ms: 4.314928
      location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:287:3'
      failureType: 'testCodeFailure'
      error: "Cannot read properties of undefined (reading '_id')"
      code: 'ERR_TEST_FAILURE'
      name: 'TypeError'
      stack: |-
        TestContext.<anonymous> (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:289:41)
        Test.runInAsyncScope (node:async_hooks:206:9)
        Test.run (node:internal/test_runner/test:796:25)
        process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)
      ...
    1..17
not ok 6 - Company Endpoints Integration
  ---
  duration_ms: 1532.539239
  type: 'suite'
  location: '/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/tests/integration/company.intergration.test.js:15:1'
  failureType: 'subtestsFailed'
  error: '11 subtests failed'
  code: 'ERR_TEST_FAILURE'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
# MongoDB connected: localhost
# METHOD: POST
# URL: /api/v1/cv/upload
# BODY: undefined
# { message: 'Must supply api_key' } Error: Must supply api_key
#     at ensureOption (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/utils/ensureOption.js:19:13)
#     at Object.sign_request (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/utils/index.js:1154:16)
#     at Object.process_request_params (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/utils/index.js:1206:22)
#     at call_api (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/uploader.js:488:18)
#     at Object.upload (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/uploader.js:55:10)
#     at Object.upload_stream (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/uploader.js:42:18)
#     at Object.upload_stream (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/cloudinary/lib/utils/index.js:1405:21)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/cloudinary.js:20:46
#     at new Promise (<anonymous>)
#     at uploadToCloudinary (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/cloudinary.js:17:10)
# Subtest: CV Endpoints Integration
    # Subtest: POST /api/v1/cv/upload should upload CV for candidate
    ok 1 - POST /api/v1/cv/upload should upload CV for candidate
      ---
      duration_ms: 63.556739
      ...
# METHOD: POST
# URL: /api/v1/cv/upload
# BODY: undefined
    # Subtest: POST /api/v1/cv/upload should return 403 for recruiter role
    ok 2 - POST /api/v1/cv/upload should return 403 for recruiter role
      ---
      duration_ms: 10.647049
      ...
# METHOD: POST
# URL: /api/v1/cv/upload
# BODY: undefined
    # Subtest: POST /api/v1/cv/upload should return 401 without token
    ok 3 - POST /api/v1/cv/upload should return 401 without token
      ---
      duration_ms: 5.047673
      ...
# METHOD: POST
# URL: /api/v1/cv/upload
# BODY: undefined
    # Subtest: POST /api/v1/cv/upload should return 400 when no file is attached
    ok 4 - POST /api/v1/cv/upload should return 400 when no file is attached
      ---
      duration_ms: 6.455125
      ...
# METHOD: POST
# URL: /api/v1/cv/upload
# BODY: undefined
    # Subtest: POST /api/v1/cv/upload should reject non-PDF files
    ok 5 - POST /api/v1/cv/upload should reject non-PDF files
      ---
      duration_ms: 6.489729
      ...
# METHOD: POST
# URL: /api/v1/cv/parse
# BODY: undefined
    # Subtest: POST /api/v1/cv/parse should return 403 for recruiter role
    ok 6 - POST /api/v1/cv/parse should return 403 for recruiter role
      ---
      duration_ms: 6.253457
      ...
# METHOD: POST
# URL: /api/v1/cv/parse
# BODY: undefined
    # Subtest: POST /api/v1/cv/parse should return 401 without token
    ok 7 - POST /api/v1/cv/parse should return 401 without token
      ---
      duration_ms: 5.346623
      ...
# METHOD: POST
# URL: /api/v1/cv/parse
# BODY: undefined
    # Subtest: POST /api/v1/cv/parse should return 400 when no file is attached
    ok 8 - POST /api/v1/cv/parse should return 400 when no file is attached
      ---
      duration_ms: 4.834105
      ...
# METHOD: POST
# URL: /api/v1/cv/parse
# BODY: undefined
# Info: (while reading XRef): FormatError: Invalid XRef stream header
# Warning: Indexing all PDF objects
# { message: 'Invalid PDF structure.', name: 'InvalidPDFException' } Error
#     at BaseExceptionClosure (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/pdf-parse-new/lib/pdf.js/v4.5.136/build/pdf.js:5458:28)
#     at Object.<anonymous> (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/pdf-parse-new/lib/pdf.js/v4.5.136/build/pdf.js:5461:2)
#     at Module._compile (node:internal/modules/cjs/loader:1521:14)
#     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
#     at Module.load (node:internal/modules/cjs/loader:1266:32)
#     at Module._load (node:internal/modules/cjs/loader:1091:12)
#     at Module.require (node:internal/modules/cjs/loader:1289:19)
#     at require (node:internal/modules/helpers:182:18)
#     at Object.<anonymous> (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/pdf-parse-new/lib/pdf-parse.js:1:15)
#     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
#   message: 'Invalid PDF structure.',
#   name: 'InvalidPDFException'
# }
    # Subtest: POST /api/v1/cv/parse should return 422 for empty/unreadable PDF
    ok 9 - POST /api/v1/cv/parse should return 422 for empty/unreadable PDF
      ---
      duration_ms: 14.598173
      ...
# METHOD: POST
# URL: /api/v1/cv/apply
# BODY: undefined
# { statusCode: 404, message: 'No profile found' } Error: No profile found
#     at Module.applyParsedCV (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/cv/cv.service.js:131:17)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/cv/cv.controller.js:41:19 {
#   statusCode: 404
# }
    # Subtest: POST /api/v1/cv/apply should return 400 when no parsed CV data exists
    ok 10 - POST /api/v1/cv/apply should return 400 when no parsed CV data exists
      ---
      duration_ms: 18.280536
      ...
# METHOD: POST
# URL: /api/v1/cv/apply
# BODY: undefined
    # Subtest: POST /api/v1/cv/apply should return 403 for recruiter role
    ok 11 - POST /api/v1/cv/apply should return 403 for recruiter role
      ---
      duration_ms: 6.187788
      ...
# METHOD: POST
# URL: /api/v1/cv/apply
# BODY: undefined
    # Subtest: POST /api/v1/cv/apply should return 401 without token
    ok 12 - POST /api/v1/cv/apply should return 401 without token
      ---
      duration_ms: 9.733273
      ...
# METHOD: POST
# URL: /api/v1/cv/apply
# BODY: undefined
    # Subtest: POST /api/v1/cv/apply should apply parsed data when parsedResume exists
    ok 13 - POST /api/v1/cv/apply should apply parsed data when parsedResume exists
      ---
      duration_ms: 32.840968
      ...
    1..13
ok 7 - CV Endpoints Integration
  ---
  duration_ms: 1197.886172
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
# MongoDB connected: localhost
# METHOD: POST
# URL: /api/v1/jobs
# BODY: {
#   companyId: '000000000000000000000002',
#   title: 'Backend Engineer',
#   description: 'Build and maintain scalable REST APIs using Node.js and MongoDB for production systems.',
#   requirements: '3+ years of Node.js experience',
#   requiredSkills: [ 'Node.js', 'MongoDB' ],
#   type: 'FULL_TIME',
#   status: 'ACTIVE',
#   country: 'Nigeria',
#   city: 'Lagos',
#   location: 'Victoria Island, Lagos',
#   salaryMin: 150000,
#   salaryMax: 300000,
#   salaryType: 'MONTHLY',
#   vacancies: 2,
#   educationLevel: 'BSC',
#   experienceLevel: 'MID',
#   jobLevel: 'MID_LEVEL'
# }
# Subtest: Job Endpoints Integration
    # Subtest: POST /api/v1/jobs should create a job for recruiter
    ok 1 - POST /api/v1/jobs should create a job for recruiter
      ---
      duration_ms: 109.025154
      ...
# METHOD: GET
# URL: /api/v1/jobs
# BODY: undefined
    # Subtest: GET /api/v1/jobs should list jobs
    ok 2 - GET /api/v1/jobs should list jobs
      ---
      duration_ms: 27.356138
      ...
# METHOD: GET
# URL: /api/v1/jobs?status=ACTIVE
# BODY: undefined
    # Subtest: GET /api/v1/jobs should support status filter
    ok 3 - GET /api/v1/jobs should support status filter
      ---
      duration_ms: 12.294537
      ...
# METHOD: GET
# URL: /api/v1/jobs?type=FULL_TIME
# BODY: undefined
    # Subtest: GET /api/v1/jobs should support type filter
    ok 4 - GET /api/v1/jobs should support type filter
      ---
      duration_ms: 9.328813
      ...
# METHOD: GET
# URL: /api/v1/jobs?country=Nigeria&city=Lagos
# BODY: undefined
    # Subtest: GET /api/v1/jobs should support country and city filter
    ok 5 - GET /api/v1/jobs should support country and city filter
      ---
      duration_ms: 10.035354
      ...
# METHOD: GET
# URL: /api/v1/jobs?isRemote=true
# BODY: undefined
    # Subtest: GET /api/v1/jobs should support isRemote filter
    ok 6 - GET /api/v1/jobs should support isRemote filter
      ---
      duration_ms: 5.801137
      ...
# METHOD: POST
# URL: /api/v1/jobs
# BODY: { title: 'No auth' }
    # Subtest: POST /api/v1/jobs should reject unauthenticated requests
    ok 7 - POST /api/v1/jobs should reject unauthenticated requests
      ---
      duration_ms: 3.714485
      ...
# METHOD: POST
# URL: /api/v1/jobs
# BODY: { title: 'Should fail' }
    # Subtest: POST /api/v1/jobs should reject candidate role
    ok 8 - POST /api/v1/jobs should reject candidate role
      ---
      duration_ms: 5.877349
      ...
    1..8
ok 8 - Job Endpoints Integration
  ---
  duration_ms: 265.471982
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: 🛡️ auth for agents: https://vestauth.com
# MongoDB connected: localhost
# METHOD: GET
# URL: /api/v1/notifications
# BODY: undefined
# Subtest: Notification Endpoints Integration
    # Subtest: GET /api/v1/notifications should return notifications
    ok 1 - GET /api/v1/notifications should return notifications
      ---
      duration_ms: 190.136922
      ...
# METHOD: PATCH
# URL: /api/v1/notifications/read-all
# BODY: undefined
    # Subtest: PATCH /api/v1/notifications/read-all should mark all as read
    ok 2 - PATCH /api/v1/notifications/read-all should mark all as read
      ---
      duration_ms: 25.733683
      ...
# METHOD: PATCH
# URL: /api/v1/notifications/69bd6d7c3915dc67ea6b36a7/read
# BODY: undefined
    # Subtest: PATCH /api/v1/notifications/:id/read should mark one as read
    ok 3 - PATCH /api/v1/notifications/:id/read should mark one as read
      ---
      duration_ms: 21.377463
      ...
# METHOD: DELETE
# URL: /api/v1/notifications/69bd6d7c3915dc67ea6b36a7
# BODY: undefined
    # Subtest: DELETE /api/v1/notifications/:id should delete a notification
    ok 4 - DELETE /api/v1/notifications/:id should delete a notification
      ---
      duration_ms: 13.617982
      ...
# METHOD: DELETE
# URL: /api/v1/notifications/69bd6d7d3915dc67ea6b36d3
# BODY: undefined
    # Subtest: DELETE /api/v1/notifications/:id should return 404 for non-existent notification
    ok 5 - DELETE /api/v1/notifications/:id should return 404 for non-existent notification
      ---
      duration_ms: 12.114802
      ...
    1..5
ok 9 - Notification Endpoints Integration
  ---
  duration_ms: 416.745407
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
# METHOD: GET
# URL: /api/v1/jobs/invalidjobid/rankings
# BODY: undefined
# { status: 400, message: 'Invalid job ID' } Error: Invalid job ID
#     at assertValidObjectId (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:15:19)
#     at getRankedCandidatesForJob (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:50:3)
#     at getRankings (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:22:24)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/asyncHandler.js:7:19
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:50:3
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at verifyToken (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:24:5) {
#   status: 400
# }
# Subtest: Scoring Endpoints Negative Cases
    # Subtest: should return 400 for invalid jobId in rankings (RECRUITER role required)
    ok 1 - should return 400 for invalid jobId in rankings (RECRUITER role required)
      ---
      duration_ms: 50.314656
      ...
# METHOD: GET
# URL: /api/v1/jobs/000000000000000000000001/rankings
# BODY: undefined
    # Subtest: should return 403 for candidate trying to access rankings
    ok 2 - should return 403 for candidate trying to access rankings
      ---
      duration_ms: 13.658658
      ...
# METHOD: GET
# URL: /api/v1/applications/invalidappid/score
# BODY: undefined
# { status: 400, message: 'Invalid application ID' } Error: Invalid application ID
#     at assertValidObjectId (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:15:19)
#     at getJobFitScoreBreakdown (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:208:3)
#     at getJobFitScore (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:45:32)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/asyncHandler.js:7:19
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:50:3
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at verifyToken (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:24:5) {
#   status: 400
# }
    # Subtest: should return 400 for invalid applicationId in score
    ok 3 - should return 400 for invalid applicationId in score
      ---
      duration_ms: 13.326206
      ...
# METHOD: GET
# URL: /api/v1/jobs/somejobid/rankings
# BODY: undefined
    # Subtest: should return 401 for unauthorized access to rankings
    ok 4 - should return 401 for unauthorized access to rankings
      ---
      duration_ms: 14.783207
      ...
# METHOD: GET
# URL: /api/v1/applications/someappid/score
# BODY: undefined
    # Subtest: should return 401 for unauthorized access to score
    ok 5 - should return 401 for unauthorized access to score
      ---
      duration_ms: 8.295955
      ...
    1..5
ok 10 - Scoring Endpoints Negative Cases
  ---
  duration_ms: 102.193562
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
# METHOD: GET
# URL: /api/v1/jobs/somejobid/rankings
# BODY: undefined
# Subtest: Scoring Endpoints Performance
    # Subtest: rankings endpoint should respond within 500ms
    ok 1 - rankings endpoint should respond within 500ms
      ---
      duration_ms: 34.499979
      ...
# METHOD: GET
# URL: /api/v1/applications/someappid/score
# BODY: undefined
    # Subtest: score endpoint should respond within 500ms
    ok 2 - score endpoint should respond within 500ms
      ---
      duration_ms: 6.806932
      ...
    1..2
ok 11 - Scoring Endpoints Performance
  ---
  duration_ms: 42.930044
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: 🤖 agentic secret storage: https://dotenvx.com/as2
# MongoDB connected: localhost
# METHOD: GET
# URL: /api/v1/jobs/invalid-id/rankings
# BODY: undefined
# { status: 400, message: 'Invalid job ID' } Error: Invalid job ID
#     at assertValidObjectId (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:15:19)
#     at getRankedCandidatesForJob (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:50:3)
#     at getRankings (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:22:24)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/asyncHandler.js:7:19
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:50:3
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at verifyToken (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:24:5) {
#   status: 400
# }
# Subtest: Scoring API Error Handling
    # Subtest: should return 400 for invalid job ID
    ok 1 - should return 400 for invalid job ID
      ---
      duration_ms: 72.955739
      ...
# METHOD: GET
# URL: /api/v1/applications/invalid-id/score
# BODY: undefined
# { status: 400, message: 'Invalid application ID' } Error: Invalid application ID
#     at assertValidObjectId (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:15:19)
#     at getJobFitScoreBreakdown (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:208:3)
#     at getJobFitScore (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:45:32)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/asyncHandler.js:7:19
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:50:3
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at verifyToken (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:24:5) {
#   status: 400
# }
    # Subtest: should return 400 for invalid application ID
    ok 2 - should return 400 for invalid application ID
      ---
      duration_ms: 25.635063
      ...
# METHOD: GET
# URL: /api/v1/jobs/000000000000000000000001/rankings
# BODY: undefined
    # Subtest: should return 401 for missing token on rankings
    ok 3 - should return 401 for missing token on rankings
      ---
      duration_ms: 22.526805
      ...
# METHOD: GET
# URL: /api/v1/applications/000000000000000000000001/score
# BODY: undefined
    # Subtest: should return 401 for missing token on score
    ok 4 - should return 401 for missing token on score
      ---
      duration_ms: 13.481627
      ...
# METHOD: GET
# URL: /api/v1/jobs/000000000000000000000001/rankings
# BODY: undefined
    # Subtest: should return 403 for invalid token
    ok 5 - should return 403 for invalid token
      ---
      duration_ms: 8.219071
      ...
# METHOD: GET
# URL: /api/v1/applications/invalid-id/score
# BODY: undefined
# { status: 400, message: 'Invalid application ID' } Error: Invalid application ID
#     at assertValidObjectId (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:15:19)
#     at getJobFitScoreBreakdown (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:208:3)
#     at getJobFitScore (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:45:32)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/utils/asyncHandler.js:7:19
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:50:3
#     at Layer.handleRequest (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/layer.js:152:17)
#     at next (/home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/node_modules/router/lib/route.js:157:13)
#     at verifyToken (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/middlewares/auth.middleware.js:24:5) {
#   status: 400
# }
    # Subtest: should return 400 for malformed application ID
    ok 6 - should return 400 for malformed application ID
      ---
      duration_ms: 7.365957
      ...
    1..6
ok 12 - Scoring API Error Handling
  ---
  duration_ms: 211.742826
  type: 'suite'
  ...
# { status: 404, message: 'Job not found' } Error: Job not found
#     at getRankedCandidatesForJob (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:54:19)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async getRankings (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:22:18) {
#   status: 404
# }
# METHOD: GET
# URL: /api/v1/jobs/000000000000000000000001/rankings
# BODY: undefined
# Subtest: Scoring API Large Data
    # Subtest: should handle non-existent job gracefully
    ok 1 - should handle non-existent job gracefully
      ---
      duration_ms: 18.188073
      ...
    1..1
ok 13 - Scoring API Large Data
  ---
  duration_ms: 18.789216
  type: 'suite'
  ...
# METHOD: GET
# URL: /api/v1/jobs/000000000000000000000001/rankings
# BODY: undefined
# { status: 404, message: 'Job not found' } Error: Job not found
#     at getRankedCandidatesForJob (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:54:19)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async getRankings (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:22:18) {
#   status: 404
# }
# Subtest: Scoring API Performance
    # Subtest: should respond within 2000ms
    ok 1 - should respond within 2000ms
      ---
      duration_ms: 13.882115
      ...
    1..1
ok 14 - Scoring API Performance
  ---
  duration_ms: 14.316247
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
# MongoDB connected: localhost
# METHOD: GET
# URL: /api/v1/jobs/69bd6d8044478d3adfd942ef/rankings
# BODY: undefined
# Subtest: Scoring Endpoints Integration
    # Subtest: GET /api/v1/jobs/:jobId/rankings should return ranked candidates for recruiter
    ok 1 - GET /api/v1/jobs/:jobId/rankings should return ranked candidates for recruiter
      ---
      duration_ms: 40.95869
      ...
# METHOD: GET
# URL: /api/v1/jobs/69bd6d8044478d3adfd942ef/rankings
# BODY: undefined
    # Subtest: GET /api/v1/jobs/:jobId/rankings should block candidate role
    ok 2 - GET /api/v1/jobs/:jobId/rankings should block candidate role
      ---
      duration_ms: 4.755738
      ...
# METHOD: GET
# URL: /api/v1/applications/69bd6d8044478d3adfd942f8/score
# BODY: undefined
    # Subtest: GET /api/v1/applications/:applicationId/score should allow owner candidate
    ok 3 - GET /api/v1/applications/:applicationId/score should allow owner candidate
      ---
      duration_ms: 10.334735
      ...
# METHOD: GET
# URL: /api/v1/applications/69bd6d8044478d3adfd942f8/score
# BODY: undefined
# {
#   status: 403,
#   message: 'You do not have permission to view this score'
# } Error: You do not have permission to view this score
#     at getJobFitScoreBreakdown (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.service.js:227:19)
#     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
#     at async getJobFitScore (file:///home/runner/work/HIRE-DEY-GO-BE/HIRE-DEY-GO-BE/src/modules/scoring/scoring.controller.js:45:26) {
#   status: 403
# }
    # Subtest: GET /api/v1/applications/:applicationId/score should block unrelated candidate
    ok 4 - GET /api/v1/applications/:applicationId/score should block unrelated candidate
      ---
      duration_ms: 10.613169
      ...
# METHOD: GET
# URL: /api/v1/jobs/69bd6d8044478d3adfd942ef/rankings
# BODY: undefined
    # Subtest: excluded candidate should have feedback and null rank
    ok 5 - excluded candidate should have feedback and null rank
      ---
      duration_ms: 348.633248
      ...
    1..5
ok 15 - Scoring Endpoints Integration
  ---
  duration_ms: 1571.37961
  type: 'suite'
  ...
# Subtest: Assessment Unit
    # Subtest: add assessment unit tests when assessment module is available
    ok 1 - add assessment unit tests when assessment module is available # TODO
      ---
      duration_ms: 1.158756
      ...
    1..1
ok 16 - Assessment Unit
  ---
  duration_ms: 2.841781
  type: 'suite'
  ...
# [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
# Subtest: Auth Service Unit
    # Subtest: should generate a 6-digit OTP
    ok 1 - should generate a 6-digit OTP
      ---
      duration_ms: 1.78694
      ...
    # Subtest: should generate access token that can be verified
    ok 2 - should generate access token that can be verified
      ---
      duration_ms: 7.213874
      ...
    # Subtest: should generate refresh token that can be verified
    ok 3 - should generate refresh token that can be verified
      ---
      duration_ms: 2.343199
      ...
    # Subtest: refreshUserToken should reject malformed token
    ok 4 - refreshUserToken should reject malformed token
      ---
      duration_ms: 1.127848
      ...
    1..4
ok 17 - Auth Service Unit
  ---
  duration_ms: 14.651424
  type: 'suite'
  ...
# Subtest: CV Parser Unit
    # Subtest: add cv parser unit tests when cv parser utility/module is available
    ok 1 - add cv parser unit tests when cv parser utility/module is available # TODO
      ---
      duration_ms: 0.948112
      ...
    1..1
ok 18 - CV Parser Unit
  ---
  duration_ms: 2.321058
  type: 'suite'
  ...
# Subtest: Job Controller Unit
    # Subtest: getJobs should apply pagination/sorting and return shaped response
    ok 1 - getJobs should apply pagination/sorting and return shaped response
      ---
      duration_ms: 2.115223
      ...
    # Subtest: getJobs should pass errors to next
    ok 2 - getJobs should pass errors to next
      ---
      duration_ms: 0.367296
      ...
    1..2
ok 19 - Job Controller Unit
  ---
  duration_ms: 3.639051
  type: 'suite'
  ...
# Subtest: Scoring Service Extreme Values
    # Subtest: should handle 100% assessment score
    ok 1 - should handle 100% assessment score
      ---
      duration_ms: 0.878001
      ...
    # Subtest: should handle 0% assessment score
    ok 2 - should handle 0% assessment score
      ---
      duration_ms: 0.200435
      ...
    # Subtest: should handle missing assessmentResultId gracefully
    ok 3 - should handle missing assessmentResultId gracefully
      ---
      duration_ms: 0.155571
      ...
    # Subtest: should handle empty application object gracefully
    ok 4 - should handle empty application object gracefully
      ---
      duration_ms: 0.196557
      ...
    1..4
ok 20 - Scoring Service Extreme Values
  ---
  duration_ms: 2.785816
  type: 'suite'
  ...
# Subtest: Scoring Service Unit
    # Subtest: calculateScoreBreakdown should return assessmentScore from result
    ok 1 - calculateScoreBreakdown should return assessmentScore from result
      ---
      duration_ms: 0.862221
      ...
    # Subtest: calculateScoreBreakdown should return 0 when no assessment result
    ok 2 - calculateScoreBreakdown should return 0 when no assessment result
      ---
      duration_ms: 0.220973
      ...
    # Subtest: calculateScoreBreakdown should return 0 when assessmentResultId is undefined
    ok 3 - calculateScoreBreakdown should return 0 when assessmentResultId is undefined
      ---
      duration_ms: 0.15533
      ...
    1..3
ok 21 - Scoring Service Unit
  ---
  duration_ms: 2.475707
  type: 'suite'
  ...
1..21
# tests 114
# suites 21
# pass 74
# fail 11
# cancelled 26
# skipped 0
# todo 3
# duration_ms 10737.186263
Error: Process completed with exit code 1.
0s