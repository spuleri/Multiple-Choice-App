'use strict';

/**
 * ---------------------NOTE----------------------
 * This is an embedded data model, containing not
 * just courses, but other vital components of the
 * application, like so:
 * Course               |
 * --Quiz Array         |   All are schemas
 * ----Question Array   |
 * ------Answer Array   |
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Potential Answer Schema
 */
var ansSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please name the quiz',
        trim: true
    },
    valid: Boolean
});

/**
 * Question Schema
 */
//TODO: Make Question Schema
var questionSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please give the question a description',
        trim: true
    },
    answers: [ansSchema]
});
/**
 * Quiz Schema
 */
var quizSchema = new Schema ({
    name: {
        type: String,
        default: '',
        required: 'Please name the quiz',
        trim: true
    },
    questions: [questionSchema]
});

/**
 * Course Schema
 */
var CourseSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Course name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    quizzes: {

    }
});

mongoose.model('Course', CourseSchema);
