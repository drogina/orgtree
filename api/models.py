from django.db import models


class Employee(models.Model):
    def __str__(self):
        return '%s %s' % (self.name, self.rank)

    def get_default_supervisor(self):
        return Employee.objects.get_or_create(rank=0)[0]

    name = models.CharField(max_length=60)
    title = models.CharField(max_length=30)
    rank = models.IntegerField(default=1)
    supervisor = models.ForeignKey(
        'self',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
