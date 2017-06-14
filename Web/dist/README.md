# Getting started

This tutorial guides you through how to use the default classifiers to classify an image and then detect faces in an image.

## Step 1: Log in, create the service, and get your credentials

You create your free instance of the Visual Recognition service through IBM® Bluemix®, so you need a free Bluemix account to get started.

**Why Bluemix?**

Bluemix is the cloud platform for the Visual Recognition service and tool. For details, see What is Bluemix?

**Tip:** If you already know your credentials for the Visual Recognition service, skip this step.

Go to the Visual Recognition service and either sign up for a free account or log into your Bluemix account.
After you log in, in the Visual Recognition page, enter visual-recognition-tutorial in the Service name field to identify this instance of the service and click Create.
Copy your credentials:
Click Service Credentials.
Click View Credentials in the "Service Credentials" section.
Copy the api-key value.
## Step 2: Classifying an image

Important: If you have Bluemix Dedicated, the endpoint used in these tutorials might not be your service endpoint. Check your endpoint URL on the Service Credentials page in your instance of the Visual Recognition service on Bluemix.

Download the sample fruitbowl.jpg image.

Issue the following curl command to upload the image and classify it against all built-in classifiers:

Replace {api-key} with the service credentials you copied earlier.
Modify the location of the images_file to point to where you saved the image.
```javascript
curl -X POST -F "images_file=@fruitbowl.jpg" "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key={api-key}&version=2016-05-20"
```
The response includes the default classifier, the classes identified in the image, and a score for each class.

```javascript
{
 "custom_classes": 0,
  "images": [
    {
        "classifiers": [
            {
                "classes": [
                    {
                        "class": "banana",
                        "score": 0.81,
                        "type_hierarchy": "/fruit/banana"
                    },
                    {
                        "class": "fruit",
                        "score": 0.922
                    },
                    {
                        "class": "mango",
                        "score": 0.554,
                        "type_hierarchy": "/fruit/mango"
                    },
                    {
                        "class": "olive color"
                        "score": 0.951
                    },
                    {
                        "class": "olive green color"
                        "score": 0.747
                    }
                ],
                "classifier_id": "default",
                "name": "default"
            }
        ],
        "image": "fruitbowl.jpg"
    }
  ],
  "images_processed": 1
}
```

Scores range from 0-1, with a higher score indicating greater correlation. The /v3/classify calls don't include low-scoring classes by default.

## Step 3: Detecting faces in an image

The Visual Recognition service can detect faces in images. The response provides information such as where the face is located in the image and the estimated age range and gender for each face.

The service can also identify many celebrities by name, and can provide a knowledge graph so that you can perform interesting aggregations into higher-level concepts.

Download the sample prez.jpg image.

Issue the following command to the POST /v3/detect_faces method to upload and analyze the image. If you use your own image, the maximum size is 2 MB:

Replace {api-key} with the service credentials you copied earlier.
Modify the location of the images_file to point to where you saved the image.
curl -X POST -F "images_file=@prez.jpg" "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key={api-key}&version=2016-05-20"
The response includes a location, age estimate, gender, identity and type hierarchy (if the service recognizes that face), and a score for each.

Scores range from 0-1, with a higher score indicating greater correlation. All faces are detected, but for images with more than 10 faces, age and gender confidence scores might return with scores of 0.

```javascript
{
  "images": [
    {
      "faces": [
        {
          "age": {
            "max": 54,
            "min": 45,
            "score": 0.364876
          },
          "face_location": {
            "height": 117,
            "left": 406,
            "top": 149,
            "width": 108
          },
          "gender": {
            "gender": "MALE",
            "score": 0.993307
          },
          "identity": {
            "name": "Barack Obama",
            "score": 0.982014
            "type_hierarchy": "/people/politicians/democrats/barack obama"
          }
        }
      ],
      "image": "prez.jpg"
    }
  ],
  "images_processed": 1
}
```

## What to do next

Now that you have a basic understanding of how to use the default Visual Recognition service classifiers, you can dive deeper:

Learn more about how to build a custom classifier.
Read about the API in the API reference.
Attributions Anchor link

"Fruit basket" by Flikr user Ryan Edwards-Crewe used under Creative Commons Attribution 2.0 license. No changes were made to this image.
"obama" by Flikr user dcblog used under Creative Commons Attribution 2.0 license. No changes were made to this image.
