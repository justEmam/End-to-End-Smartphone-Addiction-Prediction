from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import PredictInputSerializer
from .ml.predict import run_prediction
from .ml.shap_explainer import get_shap_values


@api_view(['POST'])

def predict(request):
    serializer = PredictInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {'errors': serializer.errors},
            status = status.HTTP_400_BAD_REQUEST
        )
    
    input_data = serializer.validated_data

    prediction_result = run_prediction(input_data)
    shap_result = get_shap_values(input_data)


    return Response({
        'prediction': prediction_result['prediction'],
        'probabilities': prediction_result['probabilities'],
        'shap_values': shap_result
    }, status= status.HTTP_200_OK)
