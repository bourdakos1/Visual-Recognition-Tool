var path = require('path');
var express = require('express');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var AuthorizationV1 = require('watson-developer-cloud/authorization/v1');
var fileUpload = require('express-fileupload');
var request = require('superagent');
var multer = require('multer');
var fs = require('fs');
var crypto = require('crypto');
var mime = require('mime-types')
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.VCAP_APP_PORT || 8080; //bluemix

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config');
    var compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.get('/api/token', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    var authService = new AuthorizationV1(visual_recognition.initCredentials(visual_recognition.username, visual_recognition.password));

    authService.getToken(function(err, token) {
        if (err) {
            res.send(err);
            return;
        } else {
            res.send({token: token});
        }
    });
});

app.get('/api/validate', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    request.post('https://console.dys0.bluemix.net/services/watson_vision_combined-dedicated.softbankdev/api')
    .query({
      username: username,
      password: password
    })
    .end(function(err, response) {
        res.send({valid: !(err.status == 401)});
    });
});

// app.get('/api/validate', function(req, res) {
//     var api_key = req.query.api_key;
//
//     request.post('https://gateway-a.watsonplatform.net/visual-recognition/api')
//     .query({api_key: api_key})
//     .end(function(err, response) {
//         res.send({valid: !(response.body.statusInfo == 'invalid-api-key')});
//     });
// });

app.get('/api/classifiers', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    visual_recognition.listClassifiers(req.query, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});

app.get('/api/classifiers/:id', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    visual_recognition.getClassifier({classifier_id: req.params.id }, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});

app.delete('/api/classifiers/:id', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    visual_recognition.deleteClassifier({classifier_id: req.params.id }, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});

app.get('/api/classify', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    var params = req.query;

    visual_recognition.classify(params, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});

app.get('/api/faces', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        username: req.query.username,
        password: req.query.password,
        version_date: '2016-05-20'
    });

    var params = req.query;

    visual_recognition.detectFaces(params, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.tmp/uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var type = file.mimetype;
            if (type == 'image/png' || type == 'image/jpg' || type == 'image/jpeg') {
                cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(type));
            } else {
                cb(null, raw.toString('hex') + Date.now() + '.zip');
            }
        });
    }
});

// Multer config
const upload = multer({
    limits: {
        files: 1,
        fileSize: 2 * 1024 * 1024 // 2mb
    },
    fileFilter: function(req, file, cb) {
        var type = file.mimetype;
        if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg') {
            cb(new Error('Invalid image type'));
        } else {
            cb(null, true);
        }
    },
    storage: storage
});

var fileUpload = upload.single('file')
app.post('/api/classify', function(req, res) {
    fileUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            username: req.query.username,
            password: req.query.password,
            version_date: '2016-05-20'
        });

        var params = req.query;

        params.images_file = fs.createReadStream(req.file.path);

        console.log(req.file.path)

        fs.readdir('.tmp/uploads/', (err, files) => {
            files.forEach(file => {
                console.log(file);
            });
        })

        visual_recognition.classify(params, function(err, data) {
            fs.unlinkSync(req.file.path);
            if (err) {
                res.send(err);
                return;
            }
            res.send(data);
        });

    });
});

app.post('/api/faces', function(req, res) {
    fileUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            username: req.query.username,
            password: req.query.password,
            version_date: '2016-05-20'
        });

        var params = req.query;

        params.images_file = fs.createReadStream(req.file.path);

        visual_recognition.detectFaces(params, function(err, data) {
            fs.unlinkSync(req.file.path);
            if (err) {
                res.send(err);
                return;
            }
            res.send(data);
        });
    });
});

const zipUpload = multer({
    limits: {
        fileSize: 100 * 1024 * 1024 // 100mb
    },
    fileFilter: function(req, file, cb) {
        // Let's just accept everything, because the mimetype are whack
        cb(null, true);
    },
    storage: storage
});

var filesUpload = zipUpload.array('files')
app.post('/api/classifiers', function(req, res) {
    filesUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            username: req.query.username,
            password: req.query.password,
            version_date: '2016-05-20'
        });

        var params = {
            name: req.query.name
        }

        for (var file in req.files) {
            console.log(req.files[file])
            if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                params['negative_examples'] = fs.createReadStream(req.files[file].path);
            } else {
                params[req.files[file].originalname + '_positive_examples'] = fs.createReadStream(req.files[file].path);
            }
        }

        visual_recognition.createClassifier(params, function(err, data) {
            for (var file in req.files) {
                fs.unlinkSync(req.files[file].path);
            }
            if (err) {
                res.send(err);
                return;
            }
            res.send(data);
        });
    });
});

app.put('/api/classifiers/:id', function(req, res) {
    filesUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            username: req.query.username,
            password: req.query.password,
            version_date: '2016-05-20'
        });


        var params = {
            classifier_id: req.params.id
        }

        for (var file in req.files) {
            console.log(req.files[file])
            if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                params['negative_examples'] = fs.createReadStream(req.files[file].path);
            } else {
                params[req.files[file].originalname + '_positive_examples'] = fs.createReadStream(req.files[file].path);
            }
        }

        visual_recognition.retrainClassifier(params, function(err, data) {
            for (var file in req.files) {
                fs.unlinkSync(req.files[file].path);
            }
            if (err) {
                res.send(err);
                return;
            }
            res.send(data);
        });
    });
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/dist/index.html');
});

app.get('*', function(req, response) {
    response.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
