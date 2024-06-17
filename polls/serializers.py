from rest_framework import serializers
from .models import Question, Choice


class ChoiceSerializer(serializers.Serializer):
    choice_text = serializers.CharField(max_length=200)

    def create(self, validated_data):
        return Choice.objects.create(**validated_data)
    
    class Meta:
        model = Choice

class ChoiceSerializerWithVotes(ChoiceSerializer):
    votes = serializers.IntegerField(read_only=True)

#serializer used to add votes to a particular choice of a question
class VoteSerializer(serializers.Serializer):
    choice_id = serializers.IntegerField()

#serializer mostly used when getting a list of all questions
class QuestionListSerializer(serializers.Serializer):
    question_text = serializers.CharField(max_length=200)
    pub_date = serializers.DateTimeField()
    was_published_recently = serializers.BooleanField(read_only=True) #read_only=True because we do not want it to be part of the data the serializer has to consider this field for get and post requests, because this isn't a field of the model but the output of a method
    choices = ChoiceSerializer(many=True, write_only=True)

    #Django rest framework .save() will call this function so we'll have cleaner code in the views
    def create(self, validated_data):
        choices = validated_data.pop('choices', []) #extracts choices from validated_data, [] is the default alternative
        question = Question.objects.create(**validated_data)
        for choice_dict in choices:
            choice_dict['question'] = question
            Choice.objects.create(**choice_dict)
        return question
    
    #same thing as create but for calling the .save() method and only wanting to change the fields of an object
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    class Meta:
        model = Question

#serializer used when getting one specific question with all its choices
class QuestionDetailSerializer(QuestionListSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

#serializer for getting the question with all the choices and all the votes
class QuestionResultSerializer(QuestionListSerializer):
    choices = ChoiceSerializerWithVotes(many=True, read_only=True)