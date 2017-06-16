## Overview

With the IBM Watson™ Conversation service, you can create an application that understands natural-language input and uses machine learning to respond to customers in a way that simulates a conversation between humans.

### [How to use the service](#how-to) {#how-to}

This diagram shows the overall architecture of a complete solution:

![](https://www.ibm.com/watson/developercloud/doc/conversation/images/conversation_arch_overview.png){.full-width}

* Users interact with your application through the user **interface** that you implement. For example, A simple chat window or a mobile app, or even a robot with a voice interface.

* The **application** sends the user input to the Conversation service.
    * The application connects to a workspace, which is a container for your dialog flow and training data.
    * The service interprets the user input, directs the flow of the conversation and gathers information that it needs.
    * You can connect additional Watson services to analyze user input, such as Tone Analyzer or Speech to Text.
* The application can interact with your **back-end systems** based on the user's intent and additional information. For example, answer question, open tickets, update account information, or place orders. There is no limit to what you can do.

#### Implementation

You complete these steps to implement your application:

* **Configure a workspace.** With the easy-to-use graphical environment, you set up the dialog flow and training data for your application.
* **Develop your application.** You code your application to connect to the Conversation workspace through API calls. You then integrate your app with other systems that you need, including back-end systems and third-party services such as chat services or social media.

### [Language support](#language) {#language}

Language support by feature is detailed in the [Supported languages](#) topic.

### [Next Steps](#language) {#language}

* [Get started](#) with the service
* Try out some [demos](#).
* View the list of [SDKs](#).

#### Questions and feedback

Find answers to your questions about the Conversation service in our developer communities:

* For **programming** questions, go to the Watson forums on [Stack Overflow](#).
* For Watson **products and services**, go to the Watson forum on [dW Answers](#).
* To read posts about Watson services, go to the [Watson blog](#).
