from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Question, Choice
from .serializers import QuestionListSerializer, QuestionDetailSerializer, QuestionResultSerializer, ChoiceSerializer, VoteSerializer

###VIEWS FOR QUESTIONS###

#handles operation for list of question 
@api_view(['GET', 'POST'])
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
def question_detail_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.method == 'GET':
        serializer = QuestionDetailSerializer(question)
        return Response(serializer.data)
    elif request.method == 'PATCH': #PATCH instead of PUT because we ask the client only to send us the data they want to modify, instead of modifying the entire object
        serializer = QuestionDetailSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            question = serializer.save()
            return Response(QuestionDetailSerializer(question).data)
    elif request.method == 'DELETE':
        question.delete()
        return Response("Question deleted", status=status.HTTP_204_NO_CONTENT)
    
#shows the results for a single question
@api_view(['GET'])
def question_result_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = QuestionResultSerializer(question)
    return Response(serializer.data)

#TODO add a view to create multiple questions at the same time

### VIEWS FOR QUESTIONS' CHOICES ### 

@api_view(['POST'])
def choices_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = ChoiceSerializer(data=request.data)
    if serializer.is_valid():
        choice = serializer.save(question=question)
        return Response(ChoiceSerializer(choice).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

### VIEWS FOR VOTES ON QUESTIONS' CHOCIES ###

@api_view(['PATCH'])
def vote_view(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    serializer = VoteSerializer(data=request.data)
    if serializer.is_valid():
        choice = get_object_or_404(Choice, pk=serializer.validated_data['choice_id'], question=question)
        choice.votes += 1
        choice.save()
        return Response("Voted")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)