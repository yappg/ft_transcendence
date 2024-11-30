from rest_framework.views import APIView, Response
from ..serializers import *
from ..permissions import *

#--------------------------Players RESTFUL API ------------------------------

class UserViewSet:


# dont send 400 in front if there is nothing just send empty json

# class SelfView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         return Response({
#             'username': user.username,
#             'email': user.email,
#             'avatar': user.avatar.url,
#             'cover': user.cover.url,
#             'enabled_2fa': user.enabled_2fa,
#             'verified_otp': user.verified_otp,
#         }, status=200)

# class SelfProfileView (APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = PlayerProfileSerializer(user.player_profile)
#         return Response(serializer.data, status=200)

#     def post(self, request):
#         user = request.user
#         serializer = PlayerProfileSerializer(user.player_profile, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=200)
#         return Response(serializer.errors, status=400)

#     def put(self, request):
#         user = request.user
#         serializer = PlayerProfileSerializer(user.player_profile, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=200)
#         return Response(serializer.errors, status=400)

#     def patch(self, request):
#         user = request.user
#         serializer = PlayerProfileSerializer(user.player_profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=200)
#         return Response(serializer.errors, status=400)

#     def delete(self, request):
#         user = request.user
#         user.player_profile.delete()
#         return Response({'message': 'Profile Deleted'}, status=200)




# class SelfSettingsView (APIView):
#     # permission_classes = [IsAuthenticated]



# ###############################################

# class PlayersView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request):
#         players = Player.objects.all()
#         serializer = PlayerSerializer(players, many=True)
#         return Response(serializer.data, status=200)


# class PlayersViewList(ListAPIView):
#     # permission_classes = [IsAuthenticated]
#     model = Player
#     serializer_class=PlayerSerializer
#     queryset=Player.objects.all()


# ###############################################

# class PlayerIdView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, player_id):
#         player = Player.objects.get(id=player_id)
#         serializer = PlayerSerializer(player)
#         return Response(serializer.data, status=200)


# class PlayersIdProfileView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, player_id):
#         player = Player.objects.get(id=player_id)
#         serializer = PlayerProfileSerializer(player.player_profile)
#         return Response(serializer.data, status=200)



# class PlayersIdSettingsView(APIView):
#     # permission_classes  = [IsAuthenticated]

#     def get(self, request, player_id):
#         player = Player.objects.get(id=player_id)
#         serializer = PlayerSettingsSerializer(player.player_profile)
#         return Response(serializer.data, status=200)
