require('dotenv').config();
var http = require("http");
var blc = require("broken-link-checker");

module.exports = {
    "load tool" : function (browser) {
        browser
        .url('http://localhost:8080')
        .waitForElementVisible('#landing-page', 1000)
    },

    "check bluemix link" : function (browser) {
        var urlChecker = new blc.UrlChecker(null, {
            link: function(result, customData){
                console.log('checking: ' + result.url.original);
                browser
                .assert.equal(result.brokenReason, null);
            },
            end: function(){}
        });
        browser
        .getAttribute("a#link--landing-page--api-key", "href", function(result) {
            urlChecker.enqueue(result.value);
        });
    },

    'check invalid key' : function (browser) {
        browser
        .setValue('input#input--landing-page--api-key', '0000')
        .waitForElementVisible('button#button--landing-page--api-key', 1000)
        .click('button#button--landing-page--api-key')
        .waitForElementVisible('#error--landing-page--api-key', 10000)
    },

    'check real key' : function (browser) {
        browser
        .clearValue('input#input--landing-page--api-key')
        .setValue('input#input--landing-page--api-key', process.env.API_KEY)
        .waitForElementVisible('button#button--landing-page--api-key', 1000)
        .click('button#button--landing-page--api-key')
        .waitForElementNotPresent('#landing-page', 10000)
    },

    'check 5mb dropzone' : function (browser) {
        browser
        .waitForElementVisible('.dropzone--classifier-detail:first-child', 10000)
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/large.png'))
        .waitForElementVisible('#error--classifier-detail', 1000)
    },

    // Do this test in the middle to clear out the error
    'check dropzone' : function (browser) {
        browser
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/small.jpg'))
        .waitForElementVisible('button#button--results--clear', 10000)
        .click('button#button--results--clear')
    },

    'check wrong format dropzone' : function (browser) {
        browser
        .setValue('.dropzone--classifier-detail:first-child input', require('path').resolve('test_files/small.zip'))
        .waitForElementVisible('#error--classifier-detail', 1000)
    },

    'check create close' : function (browser) {
        browser
        .click('button#button--classifiers--create')
        .waitForElementVisible('button#button--create-classifier--cancel', 1000)
        .pause(500)
        .click('button#button--create-classifier--cancel')
        .waitForElementNotPresent('button#button--create-classifier--cancel', 1000)
    },

    'check create add class' : function (browser) {
        browser
        .click('button#button--classifiers--create')
        .waitForElementVisible('.gridz-are-real span:nth-of-type(3)', 1000)
        .click('.grid-item:first-child button.delete-class')

        .waitForElementNotPresent('.gridz-are-real span:nth-of-type(3)', 1000)

        .click('button#button--create-classifier--add-class')
        .waitForElementVisible('.gridz-are-real span:nth-of-type(1)', 1000)
        .waitForElementVisible('.gridz-are-real span:nth-of-type(2)', 1000)
        .waitForElementVisible('.gridz-are-real span:nth-of-type(3)', 1000)
    },

    'check create classifier errors' : function (browser) {
        browser
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--title', 1000)
        .waitForElementVisible('#error--create-classifier--class', 1000)

        .setValue('input#input--create-classifier--classifier-name', 'My Classifier Name')
        .click('button#button--create-classifier--create')
        .waitForElementNotPresent('#error--create-classifier--title', 1000)

        .clearValue('input#input--create-classifier--classifier-name')
        .setValue('input#input--create-classifier--classifier-name', '!@#$%^&*()_+|}{":?><')
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--title', 1000)

        // .clearValue() doesn't register with react?
        .setValue('input#input--create-classifier--classifier-name','\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003')
        .setValue('.gridz-are-real span:nth-of-type(1) input.input--create-classifier--class-name', 'Class Name1')
        .setValue('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name2')
        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .setValue('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--title', 1000)
    },

    'check create class errors' : function (browser) {
        browser
        .click('.grid-item:first-child button.delete-class')
        .waitForElementNotPresent('.gridz-are-real span:nth-of-type(3)', 1000)
        .click('.grid-item:first-child button.delete-class')
        .waitForElementNotPresent('.gridz-are-real span:nth-of-type(2)', 1000)
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--class', 1000)

        .click('button#button--create-classifier--add-class')
        .waitForElementVisible('.gridz-are-real span:nth-of-type(2)', 1000)
        .setValue('.gridz-are-real span:nth-of-type(1) input.input--create-classifier--class-name', 'Class Name1')
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--class', 1000)

        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--class', 1000)

        .click('button#button--create-classifier--add-class')
        .waitForElementVisible('.gridz-are-real span:nth-of-type(3)', 1000)
        .setValue('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name1')
        .setValue('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--class', 1000)
    },

    'check create file errors' : function (browser) {
        browser
        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/huge.zip'))
        .waitForElementVisible('.gridz-are-real span:nth-of-type(1) .error--create-classifier--dropzone', 1000)

        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.jpg'))
        .waitForElementVisible('.gridz-are-real span:nth-of-type(1) .error--create-classifier--dropzone', 1000)

        .setValue('input#input--create-classifier--classifier-name', 'My Classifier Name')
        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/not_so_huge.zip'))
        .clearValue('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name')
        .setValue('.gridz-are-real span:nth-of-type(2) input.input--create-classifier--class-name', 'Class Name2')
        .setValue('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/not_so_huge.zip'))
        .click('button#button--create-classifier--add-class')
        .waitForElementVisible('.gridz-are-real span:nth-of-type(3)', 1000)
        .setValue('.gridz-are-real span:nth-of-type(3) input.input--create-classifier--class-name', 'Class Name3')
        .setValue('.gridz-are-real span:nth-of-type(3) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/not_so_huge.zip'))
        .setValue('.gridz-are-real span:nth-of-type(4) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/not_so_huge.zip'))
        .click('button#button--create-classifier--create')
        .waitForElementVisible('#error--create-classifier--class', 1000)
    },

    'check create create classifier' : function (browser) {
        browser
        .click('.grid-item:first-child button.delete-class')
        .waitForElementNotPresent('.gridz-are-real span:nth-of-type(4)', 1000)
        .click('.grid-item:first-child button.delete-class')
        .waitForElementNotPresent('.gridz-are-real span:nth-of-type(3)', 1000)
        .setValue('.gridz-are-real span:nth-of-type(1) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .setValue('.gridz-are-real span:nth-of-type(2) .dropzone--create-classifier:first-child input', require('path').resolve('test_files/small.zip'))
        .click('button#button--create-classifier--create')
        .waitForElementNotPresent('button#button--create-classifier--cancel', 60000)
    },

    'check dropdown' : function (browser) {
        browser
        .waitForElementVisible('.dropdown--classifier-detail:first-child', 10000)
        .click('.dropdown--classifier-detail:first-child')
    },

    "check api link" : function (browser) {
        var urlChecker = new blc.UrlChecker(null, {
            link: function(result, customData){
                console.log('checking: ' + result.url.original);
                browser
                .assert.equal(result.brokenReason, null);
            },
            end: function(){}
        });
        browser
        .getAttribute("a.link--classifiers--api-reference", "href", function(result) {
            urlChecker.enqueue(result.value);
        });
    },

    'check update' : function (browser) {
        browser
    },

    'check delete' : function (browser) {
        browser
        .click('a.link--classifiers--delete')
        .acceptAlert()
    },

    'check update fake key' : function (browser) {
        browser
        .click('button#button--base--update-api-key')
        .waitForElementVisible('#credentials-modal', 1000)
        .setValue('input#input--api-key-modal--api-key', '0000')
        .click('button#button--api-key-modal--submit')
        .waitForElementVisible('#error--api-key-modal--api-key', 10000)
    },

    'check update real key' : function (browser) {
        browser
        .clearValue('input#input--api-key-modal--api-key')
        .setValue('input#input--api-key-modal--api-key', process.env.API_KEY)
        .click('button#button--api-key-modal--submit')
        .waitForElementNotPresent('#credentials-modal', 10000)
    },

    'check logout' : function (browser) {
        browser
        .click('button#button--base--update-api-key')
        .waitForElementVisible('#credentials-modal', 1000)
        .click('button#button--api-key-modal--logout')
        .waitForElementVisible('#landing-page', 10000)
    },

    'finish' : function (browser) {
        browser
        .end();
    }
};
