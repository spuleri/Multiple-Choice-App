'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
            ufid: '8888-8888',
            gatorlink: 'crazyman',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
            ufid: '8888-8888',
            gatorlink: 'crazyman',
			username: 'username',
			password: 'password',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				user.firstName = 'Full';
                done();
			});
		});
        
        it('should be able to show an error when saving without proper email', function(done) {
			user.email = 'email';
			return user.save(function(err) {
				should.exist(err);
				user.email = 'test@test.com';
                done();
			});
		});
        
        it('should be able to show an error when saving without gatorlink', function(done) {
			user.gatorlink = '';
			return user.save(function(err) {
				should.exist(err);
				user.gatorlink = 'crazyman';
                done();
			});
		});
        
        it('should be able to show an error when saving without ufid', function(done) {
			user.ufid = '';
			return user.save(function(err) {
				should.exist(err);
				user.ufid = '8888-8888';
                done();
			});
		});
        
        it('should be able to show an error when saving with too few digits', function(done) {
			user.ufid = '1234-5';
			return user.save(function(err) {
				should.exist(err);
				user.ufid = '8888-8888';
                done();
			});
		});
        
        it('should be able to show an error when saving with too many digits', function(done) {
			user.ufid = '1234-56789';
			return user.save(function(err) {
				should.exist(err);
				user.ufid = '8888-8888';
                done();
			});
		});
	});

    describe('Method Update', function() {
        before(function(done) {
            user.save(done);
        });

        it('Should be able to update user information if it is changed', function(done) {
            user.firstName = 'New';
            user.lastName = 'Nam';
            user.displayName = 'New Nam';
            user.email = 'test@test.com';
            user.ufid = '8888-8888';
            user.gatorlink = 'notcrazyman';
            user.username = 'user';
            user.password = 'password';
            user.provider = 'international';
            user.update(function(err) {
                should.not.exist(err);
                done();
            })
        });

    });

	after(function(done) {
		User.remove().exec();
		done();
	});
});
