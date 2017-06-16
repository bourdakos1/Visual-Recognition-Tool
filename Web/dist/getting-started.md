## Getting started

This guide will get you up and running with the Watson Visual Recognition service. By the end you will be able to classify images with the default classifiers and be able to detect and locate faces in an image.

### [Get your credentials](#credentials) {#credentials}

In order to use Watson, you need to create the service and generate credentials on [IBM Bluemix](https://console.ng.bluemix.net/catalog/services/visual-recognition/). Bluemix is IBM’s PaaS offering that lets you deploy and manage your cloud applications.

Once you sign-up you should see the Visual Recognition service, if not, go to the **Catalog** and you should find the **Visual Recognition** service under **Watson**.

![](https://cdn-images-1.medium.com/max/1600/1*3rnUw8XecCo2hEEsXGEUCA.png){.full-width}

After creating the service, you should be able to find your API key by clicking **View Credentials** in the **Service Credentials** sections.

![](https://cdn-images-1.medium.com/max/1600/1*cvTfSHSTNfr4wxYY3tYcrA.png){.full-width}

### [Classify an Image](#classify-image) {#classify-image}
Issue the following curl command to classify the URL against all built-in classifiers:
{REPLACE_API_KEY}

```javascript
curl -X GET \
"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key={API_KEY}&url=http://vr-tool-test.mybluemix.net/demo_photos/5.jpg&version=2017-06-15"
```

> **Important:** If you have Bluemix Dedicated, the endpoint used in these tutorials might not be your service endpoint. Check your endpoint URL on the Service Credentials page in your instance of the Visual Recognition service on Bluemix.

For each image, the response includes a score for each class within each selected classifier. Scores range from 0 - 1 with a higher score indicating greater likelihood of the class being depicted in the image.

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

### [Detect faces in an image](#detect-face) {#detect-face}

The Visual Recognition service can detect faces in images. The response provides information such as where the face is located in the image and the estimated age range and gender for each face.

The service can also identify many celebrities by name, and can provide a knowledge graph so that you can perform interesting aggregations into higher-level concepts.

Download the sample [prez.jpg](#) image.

Issue the following command to the POST `/v3/detect_faces` method to upload and analyze the image. If you use your own image, the maximum size is 2 MB:
* Modify the location of the images_file to point to where you saved the image.
{REPLACE_API_KEY}

```javascript
curl -X POST -F "images_file=@prez.jpg" \
"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key={API_KEY}&version=2016-05-20"
```

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

### [What's next?](#whats-next) {#whats-next}

Now that you have a basic understanding of how to use the default Visual Recognition service classifiers, you can dive deeper:

* Learn more about how to [build a custom classifier](#).
* Read about the API in the [API reference](#).

#### Attributions

* ["Fruit basket"](#) by Flikr user [Ryan Edwards-Crewe](#) used under [Creative Commons Attribution 2.0 license](#). No changes were made to this image.
* ["obama"](#) by Flikr user [dcblog](#) used under [Creative Commons Attribution 2.0 license](#). No changes were made to this image.
