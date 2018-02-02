from rest_framework import viewsets
from api.models import Employee
from api.serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employees to be viewed or edited
    """
    queryset = Employee.objects.all().order_by('rank')
    serializer_class = EmployeeSerializer
