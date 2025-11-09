# Reciplay Test Coverage Report

**Overview**

This report summarizes the test coverage for the `@reciplay/src/test` package.

**Test Execution Summary**

The test suite for the `@reciplay/src/test` package was executed, but the tests failed to run to completion. Due to the test failures, a full coverage report could not be generated.

**Test Failures**

The following test classes encountered errors and failed to complete:

*   `AdCourseManagementServiceIntegrationTest`
*   `CourseSubApiControllerTest`
*   `EnrollmentManagementServiceImplTest`
*   `LectureApiControllerTest`
*   `LectureManagementServiceImplTest`
*   `LectureQueryServiceImplTest`
*   `QnaManagementServiceImplTest`
*   `QnaQueryServiceImplTest`
*   `LivekitControllerTest`
*   `LivekitOpenServiceImpl closeLiveRoom 통합 테스트`
*   `MyProfileManagementServiceImplIntegrationTest`
*   `AuthControllerTest`
*   `MailServiceTest`
*   `LicenseControllerTest`
*   `PersonalStatServiceImplTest`
*   `ProfileApiControllerTest`
*   `ReviewManagementServiceImplTest`
*   `ReviewQueryServiceImplTest`
*   `AuthServiceImplTest`
*   `ZzimManagementServiceImplTest`

**Error Summary**

The primary errors encountered during the test execution were:

*   `org.springframework.beans.factory.UnsatisfiedDependencyException`: This error indicates that a required dependency could not be injected.
*   `org.springframework.util.PlaceholderResolutionException`: This error suggests that a placeholder in a configuration file could not be resolved.
*   `java.lang.IllegalStateException`: This error was frequently thrown by the Spring TestContext Framework, indicating a problem with the test context setup.

**Conclusion**

The tests for the `@reciplay/src/test` package are currently failing, preventing the generation of a test coverage report. The root cause of the failures appears to be a misconfiguration of the test environment, leading to issues with dependency injection and property resolution. Further investigation is required to resolve these issues and enable the successful execution of the test suite.
