export default {
	extends: ['@archoleat/stylelint-config-extended-scss'],

	rules: {
		'plugin/use-defensive-css': [
			true,
			{
				'accidental-hover': true,
				'background-repeat': true,
				'custom-property-fallbacks': false,
				'flex-wrapping': true,
				'scroll-chaining': true,
				'scrollbar-gutter': true,
				'vendor-prefix-grouping': true,
			},
		],
		'scss/comment-no-loud': null,
		'scss/at-function-named-arguments': null,
		'selector-no-qualifying-type': null,
		'scss/media-feature-value-dollar-variable': null
	}
}