from rest_framework import serializers


class PredictInputSerializer(serializers.Serializer):
    age                     = serializers.IntegerField(min_value=6, max_value=100)
    gender                  = serializers.ChoiceField(choices=['Male', 'Female', 'Other'])
    daily_screen_time_hours = serializers.FloatField(min_value=0, max_value=24)
    social_media_hours      = serializers.FloatField(min_value=0, max_value=24)
    gaming_hours            = serializers.FloatField(min_value=0, max_value=24)
    work_study_hours        = serializers.FloatField(min_value=0, max_value=24)
    sleep_hours             = serializers.FloatField(min_value=0, max_value=24)
    notifications_per_day   = serializers.IntegerField(min_value=0)
    app_opens_per_day       = serializers.IntegerField(min_value=0)
    weekend_screen_time     = serializers.FloatField(min_value=0, max_value=24)
    stress_level            = serializers.ChoiceField(choices=['Low', 'Medium', 'High'])
    academic_work_impact    = serializers.ChoiceField(choices=['Yes', 'No'])