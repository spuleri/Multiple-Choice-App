'use strict';

module.exports = {
	app: {
		title: 'Multiple-Choice-App',
		description: 'CEN3031 Project',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				// 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				//bootflat css, needed to comment out the bootstrap theme to use the Bootflat one
				'public/lib/Bootflat/bootflat/css/bootflat.min.css',
				'public/lib/angular-xeditable/dist/css/xeditable.css',
				'public/lib/fontawesome/css/font-awesome.css'

			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/socket.io-client/socket.io.js',
                'public/lib/Chart.js/Chart.js',
                'public/lib/angular-chart.js/angular-chart.js',
				'public/lib/angular-xeditable/dist/js/xeditable.js'

				//bootflat js
				// 'public/lib/Bootflat/bootflat/js/icheck.min.js',
				// 'public/lib/Bootflat/bootflat/js/jquery.fs.selector.min.js',
				// 'public/lib/Bootflat/bootflat/js/jquery.fs.stepper.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
