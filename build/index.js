#!/usr/bin/env node
/*jslint node: true */
/*jshint node: true */
"use strict";

var buildDir = process.cwd().replace(/\/build$/, '') + '/build/';

var COMPONENTS_LIST = "../components-list.json";

var componentsListFile = require(COMPONENTS_LIST);
var fs = require('fs');
var Handlerbars = require('handlebars');


var params = componentsListFile.parameters;
var compList = componentsListFile.components;

var componentPageLayoutTemplate = fs.readFileSync(buildDir + '../library/component_doc_template.handlebars', 'utf8');

// iterate  components list
var template;
var allComponentsDocumentation = compList.map(function (compObject) {
    var name = compObject.name;

    // generate the differents html skins of the component
    var skinTemplate = fs.readFileSync(buildDir + '../' + compObject.path + '/' + params.componentHandlebarsName.replace('{name}', name), 'utf8');
    template = Handlerbars.compile(skinTemplate);

    // iterate each skins of one component
    var skinsHTML = compObject.skins.map(function (skin) {
        return template(skin);
    });
    // get the component template
    var compTemplate = fs.readFileSync(buildDir + '../' + compObject.path + '/' + params.componentDocName.replace('{name}', name), 'utf8');

    var docsTemplate = Handlerbars.compile(compTemplate)({
        name:compObject.name,
        skins:skinsHTML
    });
    // generate the component documentation
    // get the template
    // component file name
    var fileName = params.componentDocName.replace('{name}', name);


    // generate the html of the component documentation

    var componentDocHTML = Handlerbars.compile(componentPageLayoutTemplate)({
        name:compObject.name,
        content:docsTemplate
    });

    //write the documentation file
    var fileNameHTML = fileName.replace(/\.(handlebars|hbs)$/, '.html');
    var filePath = buildDir + '../' + compObject.path + '/' + fileNameHTML;


    console.log('Write Component documentation : ', compObject.name); //, 'in file : ', filePath);
    var file = fs.writeFileSync(filePath, componentDocHTML);

    return docsTemplate;
});


// get library index file
var libraryHTML = Handlerbars.compile(fs.readFileSync(buildDir + '../library/index.handlebars', 'utf8'))({
    components:allComponentsDocumentation
});

var libraryFile = buildDir + '../library/index.html';
fs.writeFileSync(libraryFile, libraryHTML, 'utf8');
console.log('Write Library File');


/*


 /*
 var componentDocBuilder = require('./tools/ComponentDocBuilder.js');
 var params, componentsList;

 function main() {
 var file = componentDocBuilder.getComponentList();
 params = file.parameters;
 componentsList = file.components;
 componentDocBuilder.parseComponents(params, componentsList);
 }
 */


/*

 main();*/