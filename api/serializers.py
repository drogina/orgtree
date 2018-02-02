from rest_framework import serializers
from api.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Check that supervisor rank is higher than employee rank
        :param data:
        :return:
        """
        try:
            employee_rank = data['rank']
        except KeyError:
            employee_rank = 0

        try:
            supervisor_rank = data['supervisor'].rank
        except (AttributeError, KeyError):
            if employee_rank >= 0:
                return data
            else:
                raise serializers.ValidationError('Supervisor must have a rank')

        if employee_rank > supervisor_rank:
            raise serializers.ValidationError('Supervisor must have a higher rank than the Employee')
        return data

    class Meta:
        model = Employee
        fields = ('id', 'url', 'name', 'title', 'rank', 'supervisor')
