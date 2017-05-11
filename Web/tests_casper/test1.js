const baseHost = 'http://localhost:8080';

casper.test.begin('Visual Recognition', 10, function suite(test) {
    // casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36(KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36');

    // casper.on('remote.message', function(message) {
    //     this.echo('remote message caught: ' + message);
    // });

    // casper.on("page.error", function(msg, trace) {
    //      this.echo(JSON.stringify(msg), 'ERROR');
    // });

    casper.start(baseHost, function() {
        casper.test.comment('Clearing localStorage');
        this.evaluate(function() {
            localStorage.clear()
        })
    })
    .viewport(1900,1000)
    .thenOpen(baseHost, function(result) {
        casper.test.comment('Starting Testing');
        casper.waitForSelector('#landing-page', function() {
            this.test.pass('load page');
        });
    })

    // -- CHECK BLUEMIX LINK

    .then(function check_invalid_key() {
        this.sendKeys('input#input--landing-page--api-key', '0000', { reset: true, keepFocus: true });
        this.waitForSelector('button#button--landing-page--api-key', function() {
            this.mouse.click('button#button--landing-page--api-key');
            this.waitForSelector('#error--landing-page--api-key', function() {
                this.test.pass('check invalid key');
            });
        });
    })

    .then(function check_real_key() {
        this.sendKeys('input#input--landing-page--api-key', '', { reset: true, keepFocus: true });
        this.waitForSelector('button#button--landing-page--api-key', function() {
            this.mouse.click('button#button--landing-page--api-key');
            this.waitWhileSelector('#landing-page', function() {
                this.test.pass('check real key');
            });
        });
    })

    .then(function check_dropdown() {
        this.waitForSelector('.dropdown--classifier-detail:first-child', function() {
            this.mouse.click('.dropdown--classifier-detail:first-child');
            this.test.pass('check dropdown');
        });
    })

    .then(function check_5mb_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/large.png'));
        this.waitForSelector('#error--classifier-detail', function() {
            this.test.pass('check 5mb dropzone');
        });
    })

    // Do this test in the middle to clear out the error
    .then(function check_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/small.jpg'));
        this.waitForSelector('button#button--results--clear', function() {
            this.mouse.click('button#button--results--clear')
            this.test.pass('check dropzone');
        });
    })

    .then(function check_wrong_format_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/small.zip'));
        this.waitForSelector('#error--classifier-detail', function() {
            this.test.pass('check wrong format dropzone');
        });
    })

    // -- CHECK API LINK

    // -- TEST UPDATE
    // Test over 100mb
    // Test over 250mb
    // Test less than 10 pics
    // Test over 10k pics
    // Test no class name
    // Test illegal characters
    // Test no files
    // Test less than 1 class
    // Test wrong file type
    // Test a successful update

    // -- TEST DELETE

    .then(function check_create_close() {
        this.mouse.click('button#button--classifiers--create');
        this.waitForSelector('button#button--create-classifier--cancel', function() {
            this.wait(500, function() {
                this.mouse.click('button#button--create-classifier--cancel');
                this.waitWhileSelector('button#button--create-classifier--cancel', function() {
                    this.test.pass('check create close');
                });
            });
        });
    })

    .then(function check_create_add_class() {
        this.mouse.click('button#button--classifiers--create');
        this.waitForSelector('.gridz-are-real span:nth-of-type(3)', function() {
            this.mouse.click('.grid-item:first-child button.delete-class');

            this.waitWhileSelector('.gridz-are-real span:nth-of-type(3)', function() {

                this.mouse.click('button#button--create-classifier--add-class');
                this.waitForSelector('.gridz-are-real span:nth-of-type(1)', function() {
                    this.waitForSelector('.gridz-are-real span:nth-of-type(2)', function() {
                        this.waitForSelector('.gridz-are-real span:nth-of-type(3)', function() {
                            this.test.pass('check create add class');
                        });
                    });
                });
            });
        });
    })

    .then(function check_create_classifier_errors() {
        this.mouse.click('button#button--create-classifier--create');
        this.waitForSelector('#error--create-classifier--title', function() {
            this.waitForSelector('#error--create-classifier--class', function() {

                this.sendKeys('input#input--create-classifier--classifier-name', 'My Classifier Name', { reset: true, keepFocus: true });
                this.mouse.click('button#button--create-classifier--create');
                this.waitWhileSelector('#error--create-classifier--title', function() {

                    this.sendKeys('input#input--create-classifier--classifier-name', '!@#$%^&*()_+|}{":?><', { reset: true, keepFocus: true });
                    this.mouse.click('button#button--create-classifier--create');
                    this.waitForSelector('#error--create-classifier--title', function() {

                        this.sendKeys('input#input--create-classifier--classifier-name', '', { reset: true, keepFocus: true });
                        this.sendKeys('.gridz-are-real span:nth-of-type(1) input.input--create-classifier--class-name', 'Class Name1', { reset: true, keepFocus: true });
                        this.sendKeys('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name2', { reset: true, keepFocus: true });
                        this.page.uploadFile('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
                        this.page.uploadFile('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
                        this.mouse.click('button#button--create-classifier--create');
                        this.waitForSelector('#error--create-classifier--title', function() {
                            this.test.pass('check create classifier errors');
                        });
                    });
                });
            });
        });
    })

    .then(function check_create_class_errors() {
        this.mouse.click('.grid-item:first-child button.delete-class');
        this.waitWhileSelector('.gridz-are-real span:nth-of-type(3)', function() {
            this.mouse.click('.grid-item:first-child button.delete-class');
            this.waitWhileSelector('.gridz-are-real span:nth-of-type(2)', function() {
                this.mouse.click('button#button--create-classifier--create');
                this.waitForSelector('#error--create-classifier--class', function() {

                    this.mouse.click('button#button--create-classifier--add-class');
                    this.waitForSelector('.gridz-are-real span:nth-of-type(2)', function() {
                        this.sendKeys('.gridz-are-real span:nth-of-type(1) input.input--create-classifier--class-name', 'Class Name1', { reset: true, keepFocus: true });
                        this.mouse.click('button#button--create-classifier--create');
                        this.waitForSelector('#error--create-classifier--class', function() {

                            this.page.uploadFile('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
                            this.mouse.click('button#button--create-classifier--create');
                            this.waitForSelector('#error--create-classifier--class', function() {

                                this.mouse.click('button#button--create-classifier--add-class');
                                this.waitForSelector('.gridz-are-real span:nth-of-type(3)', function() {
                                    this.sendKeys('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name1', { reset: true, keepFocus: true });
                                    this.page.uploadFile('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
                                    this.mouse.click('button#button--create-classifier--create');
                                    this.waitForSelector('#error--create-classifier--class', function() {
                                        this.test.pass('check create class errors');
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })

    .then(function check_create_file_errors() {
        this.page.uploadFile('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/huge.zip'));
        this.waitForSelector('.gridz-are-real span:nth-of-type(1) .error--create-classifier--dropzone', function() {

            this.page.uploadFile('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/huge.zip'));
            this.waitForSelector('.gridz-are-real span:nth-of-type(2) .error--create-classifier--dropzone', function() {

                this.sendKeys('input#input--create-classifier--classifier-name', 'My New Name');
                this.wait(500, function() {
                    // Not sure why this is necessary
                });
                this.page.uploadFile('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/not_so_huge.zip'));
                this.sendKeys('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name2', { reset: true, keepFocus: true });
                this.page.uploadFile('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/not_so_huge.zip'));
                this.mouse.click('button#button--create-classifier--add-class');
                this.waitForSelector('.gridz-are-real span:nth-of-type(3)', function() {
                    this.sendKeys('.gridz-are-real span:nth-of-type(3) input.input--create-classifier--class-name', 'Class Name3', { reset: true, keepFocus: true });
                    this.page.uploadFile('.gridz-are-real span:nth-of-type(3) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/not_so_huge.zip'));
                    this.page.uploadFile('.gridz-are-real span:nth-of-type(4) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/not_so_huge.zip'));
                    this.mouse.click('button#button--create-classifier--create');
                    this.waitWhileSelector('#error--create-classifier--title', function() {
                        if ("The service accepts a maximum of 256 MB per training call." != this.fetchText('#error--create-classifier--class')) {
                            this.warn("Error messages do not match!\nExpected: The service accepts a maximum of 256 MB per training call.\nActual: " + this.fetchText('#error--create-classifier--class'));
                        }
                        this.test.pass('check create file errors');
                    });
                });
            });
        });
    })

    // .then(function check_create_create_classifier() {
    //     this.mouse.click('.grid-item:first-child button.delete-class');
    //     this.waitWhileSelector('.gridz-are-real span:nth-of-type(4)', function() {
    //         this.mouse.click('.grid-item:first-child button.delete-class');
    //         this.waitWhileSelector('.gridz-are-real span:nth-of-type(3)', function() {
    //             this.page.uploadFile('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
    //             this.page.uploadFile('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('fs').absolute('test_files/small.zip'));
    //             this.mouse.click('button#button--create-classifier--create');
    //             this.wait(500, function() {
    //                 this.capture('load.jpg');
    //             });
    //             this.waitWhileSelector('#button--create-classifier--cancel', function() {
    //                 this.capture('worked.jpg')
    //                 this.test.pass('check create create classifier');
    //             }, null, 60000);
    //         });
    //     });
    // })

    .then(function check_update_fake_key() {
        this.mouse.click('button#button--base--update-api-key');
        this.waitForSelector('#exampleModal', function() {
            this.wait(500, function() {
                this.sendKeys('input#input--api-key-modal--api-key', '0000', { reset: true, keepFocus: true });
                this.mouse.click('button#button--api-key-modal--submit')
                this.waitForSelector('#error--api-key-modal--api-key', function() {
                    this.test.pass('check update fake key');
                });
            });
        });
    })

    .then(function check_update_real_key() {
        this.sendKeys('input#input--api-key-modal--api-key', '', { reset: true, keepFocus: true });
        this.mouse.click('button#button--api-key-modal--submit');
        this.waitWhileSelector('#exampleModal', function() {
            this.test.pass('check update real key');
        });
    })

    .then(function check_logout() {
        this.mouse.click('button#button--base--update-api-key')
        this.waitForSelector('#exampleModal', function() {
            this.wait(500, function() {
                this.mouse.click('button#button--api-key-modal--logout')
                this.waitForSelector('#landing-page', function() {
                    this.test.pass('check logout');
                });
            });
        });
    })

    .run(function () {
        test.done();
    })
});
