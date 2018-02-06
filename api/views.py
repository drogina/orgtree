from rest_framework import viewsets, serializers
from api.models import Employee
from api.serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employees to be viewed or edited
    """
    queryset = Employee.objects.all().order_by('rank')
    serializer_class = EmployeeSerializer

    def perform_destroy(self, instance):
        child_count = Employee.objects.filter(supervisor=instance.id).count()
        if child_count > 0:
            raise serializers.ValidationError('You cannot delete an employee with children')

        instance.delete()
