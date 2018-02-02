from django.conf.urls import url, include
from rest_framework import routers
from api import views


router = routers.DefaultRouter()
router.register(r'employees', views.EmployeeViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
