<?php
// https://github.com/FriendsOfPHP/PHP-CS-Fixer

$finder = PhpCsFixer\Finder::create()
	->in(__DIR__);

return PhpCsFixer\Config::create()
	->setUsingCache(false)
	->setIndent("\t")
	->setFinder($finder)
	->setRiskyAllowed(true)
	->setRules([
		// Mostly use PSR-2 ...
		'@PSR2' => true,

		// ... exceptions
		'braces' => [
			'position_after_functions_and_oop_constructs' => 'same',
		],

		// ... additions
		'binary_operator_spaces' => [
			'operators' => [
				'===' => 'align_single_space_minimal',
				'!==' => 'align_single_space_minimal',
				'=='  => 'align_single_space_minimal',
				'!='  => 'align_single_space_minimal',
				'='   => 'align_single_space_minimal',
				'=>'  => 'align_single_space_minimal',
			],
		],

		'array_syntax' => [
			'syntax' => 'short',
		],

		'concat_space' => [
			'spacing' => 'one',
		],

		// Custom config @JustCarmen
		'no_unused_imports' => true,
		'single_line_after_imports' =>false,
		'line_ending' => false // to prevent mixed line endings
	]);
