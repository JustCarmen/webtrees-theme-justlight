<?php
// Header for bootstrap theme
//
// webtrees: Web based Family History software
// Copyright (C) 2013 webtrees development team.
//
// Derived from PhpGedView
// Copyright (C) 2002 to 2009 PGV Development Team.  All rights reserved.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

if (!defined('WT_WEBTREES')) {
	header('HTTP/1.0 403 Forbidden');
	exit;
}

// This theme uses extra javascript
$this
	->addExternalJavascript(WT_JQUERY_COLORBOX_URL)
	->addExternalJavascript(WT_JQUERY_WHEELZOOM_URL)
	->addExternalJavascript(JL_THEME_URL . 'js/jquery.waituntilexists.min.js')
	->addExternalJavascript(JL_BOOTSTRAP_URL .'js/bootstrap.min.js')
	->addExternalJavascript(JL_BOOTSTRAP_URL .'js/justlight.bootstrap.js')	
	->addExternalJavascript(JL_THEME_URL . 'js/justlight.js')
	->addExternalJavascript(JL_COLORBOX_URL . 'justlight.colorbox.js')
	->addInlineJavascript('
		// load bootstrap datatable script
		if(jQuery(".dataTable").length){
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src="'.JL_BOOTSTRAP_URL.'js/dataTables.bootstrap.js";
			document.body.appendChild(script);
		}
	');
	if(WT_SCRIPT_NAME === 'individual.php' || WT_Filter::get('mod_action') === 'treeview') {
		$this->addInlineJavascript('
			// load treeview stylesheet
			var head = document.getElementsByTagName("head")[0];
			var css = document.createElement("link");
			css.setAttribute("rel", "stylesheet");
			css.setAttribute("type", "text/css");
			css.setAttribute("href", "'.WT_CSS_URL.'treeview.css");
			head.appendChild(css);
		', WT_CONTROLLER_BASE::JS_PRIORITY_LOW);
	}
?>
<!DOCTYPE html>
<html <?php echo WT_I18N::html_markup(); ?>>
<head>
	<meta charset="UTF-8"> 
	<title><?php echo WT_Filter::escapeHtml($title); ?></title> 
	<?php echo header_links($META_DESCRIPTION, $META_ROBOTS, $META_GENERATOR, $LINK_CANONICAL); ?> 
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="<?php echo WT_CSS_URL; ?>favicon.png" type="image/png">	
	<link rel="stylesheet" type="text/css" href="<?php echo JL_JQUERY_UI_CSS; ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo JL_COLORBOX_URL; ?>colorbox.css">
	<link href="<?php echo JL_BOOTSTRAP_URL; ?>css/bootstrap.min.css" rel="stylesheet">
	<link href="<?php echo JL_BOOTSTRAP_URL; ?>css/bootstrap-theme.min.css" rel="stylesheet">
	<link href="<?php echo JL_BOOTSTRAP_URL; ?>css/dataTables.bootstrap.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="<?php echo WT_CSS_URL; ?>style.css">
	<link rel="stylesheet" type="text/css" href="<?php echo WT_CSS_URL; ?>justlight.css">	
</head>
<body id="body">
	<?php if ($view!='simple') { 
	getJLScriptVars(); ?>
	<div id="wrap">
		<div class="navbar navbar-default navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container-fluid">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<div class="navbar-header">
					  <h1><a href="index.php" class="navbar-brand"><?php echo WT_TREE_TITLE; ?></a></h1>
					</div>

					<div class="navbar-collapse collapse">
						<div class="div_search">
							<form action="search.php" method="post">
								<input type="hidden" name="action" value="general" />
								<input type="hidden" name="topsearch" value="yes" />
								<input type="search" name="query" id="searc-basic" placeholder="<?php echo WT_I18N::translate('Search'); ?>" dir="auto" />
								<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span></button>
							</form>
						</div>
						<div class="navbar-right">
							<?php
							echo JL_TopMenu::getFavoritesMenu();
							if (WT_GED_ID && !$SEARCH_SPIDER && WT_Site::getPreference('ALLOW_USER_THEMES') && $WT_TREE->getPreference('ALLOW_THEME_DROPDOWN')) {
								echo JL_TopMenu::getTopMenu(WT_I18N::translate('Theme'), "themes");
							}
							echo JL_TopMenu::getTopMenu(WT_I18N::translate('Language'), "languages");								
							if (WT_USER_ID) {
								echo JL_TopMenu::getTopMenu(WT_I18N::translate('My account'), 'login');							
							} else { ?>
								<a href="login.php" class="btn btn-default">Login</a>
							<?php } ?>	   
						</div><!--/.navbar-right -->
						<div class="navbar-text">
							<ul class="nav nav-pills" role="tablist">							
								<?php echo getJLNavMenu(); ?>
							</ul>
						</div><!-- /.navbar-text -->
					</div><!--/.nav-collapse -->
				</div><!-- /.container-fluid -->
			</div><!-- /.navbar-inner -->
		</div><!-- /.navbar -->		
	<?php }
	echo $javascript;
	echo WT_FlashMessages::getHtmlMessages();
	if(WT_Filter::get('action') === 'addnewnote_assisted') {
		$style = 'style="width: 100%"';
		$this->addInlineJavascript('jQuery("#edit_interface-page").addClass("census-assistant")');
	}
	else {
		$style = WT_SCRIPT_NAME === 'individual.php' || WT_SCRIPT_NAME === 'family.php' || WT_SCRIPT_NAME === 'medialist.php' || WT_Filter::get('mod_action') === 'treeview' ? ' style="width: 100%"' : '';
	}	
	?>
		<div id="responsive"></div><div id="content" class="container"<?php echo $style ?>>