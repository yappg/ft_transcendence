# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import YourRequestSerializer
# from drf_yasg.utils import swagger_auto_schema
# from drf_yasg import openapi

# class YourAPIView(APIView):
#     @swagger_auto_schema(
#         request_body=YourRequestSerializer,
#         responses={200: 'Success', 400: 'Invalid input'}
#     )
#     def post(self, request):
#         serializer = YourRequestSerializer(data=request.data)
#         if serializer.is_valid():
#             # Process the data
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)