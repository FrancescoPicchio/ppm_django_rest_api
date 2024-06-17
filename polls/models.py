from django.db import models
#libraries for having access to timezone and check dates of polls
from datetime import datetime, timedelta
from django.utils import timezone

# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.question_text

    def was_published_recently(self):
        now = timezone.now()
        return now - timedelta(days=1) <= self.pub_date <= now #checks if the pubdate was yesterday
    
    #naming a method not with a verb because this will be an attribute in the associated serializer
    def choices(self):
        if not hasattr(self, '_choices'):
            self._choices = self.choice_set.all()
        return self._choices


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE) #each choice is related to a singular question
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text