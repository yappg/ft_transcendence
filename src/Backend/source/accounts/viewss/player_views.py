from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.views import APIView, Response
from rest_framework import status
from ..serializers import *
from ..permissions import *
from rest_framework import request

# from rest_framework import generics




#--------------------------Players RESTFUL API ------------------------------

class accountView(APIView):
    permission_classes = [AllowAny]
    serializers_class = PlayerSerializer
    model = Player

    def get(self, request):
        # print(f"         DEBUG ======> {request.headers}\n")
        accounts = self.model.objects.all()
        # print("profile for id 10=============>", accounts.get(pk=10))
        serlize = self.serializers_class(accounts, many=True)
        return (Response(data=serlize.data, status=status.HTTP_200_OK))

    def post(self, request):
        serlizer = self.serializers_class(data=request.data)
        if serlizer.is_valid():
            serlizer.save()
            return (Response(data=serlizer.data, status=status.HTTP_201_CREATED))
        return (Response(data=serlizer.error_messages, status=status.HTTP_400_BAD_REQUEST))


class accountProfileView(APIView):
    permission_classes = [AllowAny]
    serializers_classes = PlayerProfileSerializer
    model = PlayerProfile

    def get(self, request):
        profiles = self.model.objects.all()
        serlize = self.serializers_classes(profiles, many=True)
        return (Response(data=serlize.data, status=status.HTTP_200_OK))

    def post(self, request):
        serlize = self.serializers_classes(data=request.data)
        if serlize.is_valid():
            serlize.save()
            return (Response(data=serlize.data, status=status.HTTP_201_CREATED))
        return (Response(data=serlize.error_messages, status=status.HTTP_400_BAD_REQUEST))


#only for if user is same as
class accoutSettingView(APIView):
    permission_classes = [AllowAny]
    serializers_classes = PlayerSettings



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
