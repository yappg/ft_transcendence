# from django.test import TestCase, RequestFactory
# from django.contrib.auth import get_user_model
# from django.http import HttpResponse
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from django.utils.timezone import now
# import datetime

# class AccessTokenMiddlewareTestCase(TestCase):
#     def setUp(self):
#         # Get the custom User model
#         User = get_user_model()
        
#         # Create a test user using the custom User model
#         self.user = User.objects.create_user(
#             username='testuser',  # Adjust fields according to your custom User model
#             password='testpassword'
#             # Add any other required fields for your custom User model
#         )
        
#         # Generate refresh token for the test user
#         self.refresh_token = RefreshToken.for_user(self.user)
#         self.access_token = str(self.refresh_token.access_token)

#     def test_valid_access_token(self):
#         """
#         Test middleware with a valid access token
#         """
#         # Create a request factory
#         factory = RequestFactory()
        
#         # Create a request with access token
#         request = factory.get('/test/')
#         request.COOKIES['access_token'] = self.access_token
#         request.COOKIES['refresh_token'] = str(self.refresh_token)

#         # Import the middleware
#         from accounts.middleware import AccessTokenMiddleware  # Update with your actual import
        
#         # Create a mock get_response that returns a response
#         def mock_get_response(request):
#             return HttpResponse("Test response")
        
#         # Initialize middleware
#         middleware = AccessTokenMiddleware(mock_get_response)

#         # Call middleware
#         response = middleware(request)
        
#         # Assert that a response is returned
#         self.assertIsNotNone(response)
#         self.assertEqual(response.content, b"Test response")

#     def test_token_expiring_soon(self):
#         """
#         Test token refresh when access token is about to expire
#         """
#         # Create a request factory
#         factory = RequestFactory()
        
#         # Create a request with access token
#         request = factory.get('/test/')
#         request.COOKIES['access_token'] = self.access_token
#         request.COOKIES['refresh_token'] = str(self.refresh_token)

#         # Import the middleware
#         from accounts.middleware import AccessTokenMiddleware  # Update with your actual import
        
#         # Create a mock get_response that returns a response
#         def mock_get_response(request):
#             return HttpResponse("Test response")

#         # Initialize middleware
#         middleware = AccessTokenMiddleware(mock_get_response)

#         # Simulate a token about to expire by mocking the validation
#         with self.settings(JWT_EXPIRATION_DELTA=datetime.timedelta(minutes=4)):
#             response = middleware(request)
        
#         # Check that a response is returned
#         self.assertIsNotNone(response)
#         self.assertEqual(response.content, b"Test response")
#         # You might want to add additional checks for token refresh
#         # self.assertIn('access_token', response.cookies)

#     def test_missing_tokens(self):
#         """
#         Test middleware with missing tokens
#         """
#         # Create a request factory
#         factory = RequestFactory()
        
#         # Create a request without tokens
#         request = factory.get('/test/')

#         # Import the middleware
#         from accounts.middleware import AccessTokenMiddleware  # Update with your actual import
        
#         # Create a mock get_response that returns a response
#         def mock_get_response(request):
#             return HttpResponse("Test response")
        
#         # Initialize middleware
#         middleware = AccessTokenMiddleware(mock_get_response)

#         # Call middleware
#         response = middleware(request)
        
#         # Assert that a response is returned
#         self.assertIsNotNone(response)
#         self.assertEqual(response.content, b"Test response")

#     def test_invalid_refresh_token(self):
#         """
#         Test middleware with an invalid refresh token
#         """
#         # Create a request factory
#         factory = RequestFactory()
        
#         # Create a request with an invalid refresh token
#         request = factory.get('/test/')
#         request.COOKIES['access_token'] = 'invalid_access_token'
#         request.COOKIES['refresh_token'] = 'invalid_refresh_token'

#         # Import the middleware
#         from accounts.middleware import AccessTokenMiddleware  # Update with your actual import
        
#         # Create a mock get_response that returns a response
#         def mock_get_response(request):
#             return HttpResponse("Test response")
        
#         # Initialize middleware
#         middleware = AccessTokenMiddleware(mock_get_response)

#         # Call middleware
#         response = middleware(request)
        
#         # Assert that a response is returned
#         self.assertIsNotNone(response)
#         self.assertEqual(response.content, b"Test response")