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
 * A Validation function for local strategy properties
 */
 
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

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
    created: {
        type: Date,
        default: Date.now
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
    created: {
        type: Date,
        default: Date.now
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
	courseCode: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in the course code']
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    roster: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
    quizzes: [quizSchema]
});

mongoose.model('Course', CourseSchema);
