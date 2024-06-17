from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.questions_view, name='questions_view'),
    path('questions/<int:question_id>/', views.question_detail_view, name='question_detail_view'),
    path('questions/<int:question_id>/choices/', views.choices_view, name='choices_view'),
    path('questions/<int:question_id>/vote/', views.vote_view, name='vote_view'),
    path('questions/<int:question_id>/result/', views.question_result_view, name='question_result_view'),
]
