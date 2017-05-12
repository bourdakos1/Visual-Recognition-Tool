# Watson Visual Recognition Tool

https://visual-recognition-tooling.mybluemix.net/

[![Deploy to Bluemix](https://console.ng.bluemix.net/devops/setup/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.ibm.com/watson-vision/visual-recognition-tooling)

## Getting started

1. You need a Bluemix account. If you don't have one, [sign up][sign_up].

1. Download and install the [Cloud-foundry CLI][cloud_foundry] tool if you haven't already.

1. Edit the `manifest.yml` file and change `<application-name>` to something unique. The name you use determines the URL of your application. For example, `<application-name>.mybluemix.net`.

  ```yaml
  applications:
  - name: <application-name>
    command: npm start
    path: .
    memory: 512M
  ```

1. Connect to Bluemix with the command line tool.

  ```bash
  cf api https://api.ng.bluemix.net
  cf login
  ```

1. Install the dependencies you application need:

  ```none
  npm install
  ```

1. Start the application locally:

  ```none
  npm start
  ```

1. Point your browser to [http://localhost:8080](http://localhost:8080).

1. **Optional:** Push the application to Bluemix:

  ```none
  cf push
  ```

After completing the steps above, you are ready to test your application. Start a browser and enter the URL of your application.

  ```none
  <your application name>.mybluemix.net
  ```

## Troubleshooting

* The main source of troubleshooting and recovery information is the Bluemix log. To view the log, run the following command:

  ```sh
  cf logs <application-name> --recent
  ```

[cloud_foundry]: https://github.com/cloudfoundry/cli
[sign_up]: https://console.ng.bluemix.net/registration/
