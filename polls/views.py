from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Question, Choice
from .serializers import QuestionListSerializer, QuestionDetailSerializer, QuestionResultSerializer, ChoiceSerializer, VoteSerializer
from .permissions import IsCreatorOrReadOnly

###VIEWS FOR QUESTIONS###

#handles operation for list of question 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def questions_view(request):
    if request.method == 'GET':
        questions = Question.objects.all()
        serializer = QuestionListSerializer(questions, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = QuestionListSerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.save()
            return Response(QuestionListSerializer(question).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#handles crud operations on single questions that are already created
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated, IsCreatorOrReadOnly])
def question_detail_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)

    # Check object-level permissions for unsafe methods
    if request.method not in SAFE_METHODS:
        permission = IsCreatorOrReadOnly()
        if not permission.has_object_permission(request, None, question):
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = QuestionResultSerializer(question)
        return Response(serializer.data)
    elif request.method == 'PATCH': #PATCH instead of PUT because we ask the client only to send us the data they want to modify, instead of modifying the entire object
        serializer = QuestionDetailSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            question = serializer.save()
            return Response(QuestionDetailSerializer(question).data)
    elif request.method == 'DELETE':
        question.delete()
        return Response("Question deleted", status=status.HTTP_204_NO_CONTENT)
    
#FIXME it's kinda a useless view
#shows the results for a single question
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def question_result_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = QuestionResultSerializer(question)
    return Response(serializer.data)

#TODO add a view to create multiple questions at the same time

### VIEWS TO ADD CHOICES TO QUESTION ### 

@api_view(['POST'])
@permission_classes([IsCreatorOrReadOnly, IsAuthenticated])
def choices_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = ChoiceSerializer(data=request.data)

    # Check object-level permissions for unsafe methods
    if request.method not in SAFE_METHODS:
        permission = IsCreatorOrReadOnly()
        if not permission.has_object_permission(request, None, question):
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    if serializer.is_valid():
        choice = serializer.save(question=question)
        return Response(ChoiceSerializer(choice).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

### VIEWS FOR VOTING ON QUESTIONS' CHOCIES ###

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def vote_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = VoteSerializer(data=request.data)
    if serializer.is_valid():
        choice = get_object_or_404(Choice, pk=serializer.validated_data['choice_id'], question=question)
        if not question.has_user_voted(request.user):
            choice.voters.add(request.user)
            return Response("Voted") 
        return Response({'detail': 'You have already voted, only one vote per user.'}, status=status.HTTP_403_FORBIDDEN)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)