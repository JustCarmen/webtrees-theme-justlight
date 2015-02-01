<?php
// JustLight theme
//
// webtrees: Web based Family History software
// Copyright (C) 2015 webtrees development team.
// Copyright (C) 2015 JustCarmen
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
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA

use WT\Auth;

class JustLightTheme extends WT\Theme\BaseTheme {

	/** @var string the location of this theme */
	private $theme_dir;

	/** @var string the location of the custom javascript files */
	private $js_url;

	/** @var string the location of the bootstrap theme files */
	private $bootstrap_url;

	/** @var string the location of the jquery-ui files */
	private $jquery_ui_url;

	/** @var string the location of the colorbox files */
	private $colorbox_url;
	
	/** {@inheritdoc} */
	public function assetUrl() {
		return 'themes/justlight/css-1.7.0/';
	}

	/** {@inheritdoc} */
	public function bodyHeader() {
		try {
			return
				'<body>' .
				'<div id="wrap">' .
				'<header>' .
				'<div id="nav-container" class="navbar navbar-default navbar-fixed-top">' .
				'<div class="navbar-inner">' .
				'<div class="container-fluid">' .
				'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' .
				'<span class="icon-bar"></span>' .
				'<span class="icon-bar"></span>' .
				'<span class="icon-bar"></span>' .
				'</button>' .
				$this->headerContent() .
				$this->primaryMenuContainer($this->primaryMenu()) .
				'</div></div></div>' .
				$this->flashMessagesContainer(WT_FlashMessages::getMessages()) .
				$this->formatPendingChangesLink() .
				'</header>' .
				'<div id="responsive"></div>' .
				'<main id="content" role="main" class="container"' . $this->mainContentStyle() . '>';
		} catch (Exception $ex) {
			parent::bodyHeader();
		}
	}

	public function bodyHeaderPopupWindow() {
		try {
			if (WT_Filter::get('action') === 'addnewnote_assisted') {
				$class = 'class="census-assistant"';
			} else {
				$class = '';
			}

			return
				'<body class="container container-popup">' .
				'<main id="content"' . $class . '" role="main">' .
				$this->flashMessagesContainer(WT_FlashMessages::getMessages());
		} catch (Exception $ex) {
			return parent::bodyHeaderPopupWindow();
		}
	}
	
	private function compactMenuContainer($menu) {
		$html = '<li id="' . $menu->getId() . '" class="dropdown">';
		$html .= '<a class="dropdown-toggle" data-toggle="dropdown" href="#">' . $menu->getLabel() . '<span class="caret"></span></a>';
		$html .= '<ul class="dropdown-menu" role="menu">';
		foreach ($menu->getSubmenus() as $submenu) {
			$html .= '<li id="' . $submenu->getId() .'" class="dropdown-submenu">';
			$html .= '<a class="dropdown-submenu-toggle" href="#">' . $submenu->getLabel() . '<span class="right-caret"></span></a>';
			
			$html .= '<ul class="dropdown-menu sub-menu">';
			foreach ($submenu->getSubmenus() as $subsubmenu) {				
				$html .= '<li id="' . $subsubmenu->getId() . '">';
				$html .= '<a href="' . $subsubmenu->getLink() . '"' . $subsubmenu->getOnclick() . '>' . $subsubmenu->getLabel() . '</a>';
				$html .= '</li>';				
			}
			$html .= '</ul></li>';
		}
		$html .= '</ul></li>';
		return $html;
	}	

	/** {@inheritdoc} */
	public function footerContainer() {
		try {
			return
				'</main>' .
				'<div id="push"></div>' .
				'</div>' .
				'<footer>' . $this->footerContent() . '</footer>';
		} catch (Exception $ex) {
			parent::footerContainer();
		}
	}
	
	/** {@inheritdoc} */
	public function footerContent() {
		try {
			return
			$this->formatContactLinks() .
			'<div class="credits">' . $this->logoPoweredBy() . '</div>';
		} catch (Exception $ex) {
			parent::footerContent();
		}
		
		
	}
	
	/** {@inheritdoc} */
	public function formQuickSearchFields() {
		try {
			return
				'<input type="search" name="query" id="searc-basic" placeholder="' . WT_I18N::translate('Search') . '" dir="auto" />' .
				'<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span></button>';
		} catch (Exception $ex) {
			return parent::formQuickSearchFields();
		}
	}

	/** {@inheritdoc} */
	public function formatSecondaryMenu() {
		try {
			return
				'<div class="navbar-right">' .
				$this->secondaryMenuContainer($this->secondaryMenu()) .
				$this->menuLogin() .
				'</div>';
		} catch (Exception $ex) {
			return parent::formatSecondaryMenu();
		}
	}

	/** {@inheritdoc} */
	public function formatTreeTitle() {
		try {
			return
				'<div class="navbar-header">' .
				'<h1><a href="index.php" class="navbar-brand">' . $this->tree->titleHtml() . '</a></h1>' .
				'</div>';
		} catch (Exception $ex) {
			return parent::formatTreeTitle();
		}
	}

	/** {@inheritdoc} */
	public function headerContent() {
		try {
			return
				$this->formatTreeTitle() .
				'<div class="navbar-collapse collapse navbar-top">' .
				'<div class="div_search">' . $this->formQuickSearch() . '</div>' .
				$this->formatSecondaryMenu() .
				'</div>';
		} catch (Exception $ex) {
			return parent::headerContent();
		}
	}

	/** {@inheritdoc} */
	public function hookAfterInit() {
		try {
			// Put a version number in the URL, to prevent browsers from caching old versions.
			$this->theme_dir = 'themes/justlight/';
			$this->js_url = 'themes/justlight/js-1.7.0/';
			$this->bootstrap_url = $this->theme_dir . 'bootstrap-3.3.2/';
			$this->jquery_ui_url = $this->theme_dir . 'jquery-ui-1.11.2/';
			$this->colorbox_url = $this->theme_dir . 'colorbox-1.5.14/';
			// Always collapse notes on the medialist page
			$this->pageMedialist();
		} catch (Exception $ex) {
			return parent::hookAfterInit();
		}
	}

	/** {@inheritdoc} */
	public function hookFooterExtraJavascript() {
		try {
			return
				$this->scriptVars() .
				'<script src="' . WT_BOOTSTRAP_JS_URL . '"></script>' .
				'<script src="' . WT_JQUERY_COLORBOX_URL . '"></script>' .
				'<script src="' . WT_JQUERY_WHEELZOOM_URL . '"></script>' .
				'<script src="' . $this->js_url . 'jquery.waituntilexists.min.js"></script>' .
				'<script src="' . $this->js_url . 'justlight.js"></script>' .
				'<script src="' . $this->bootstrap_url . 'js/justlight.bootstrap.js"></script>' .
				'<script src="' . $this->colorbox_url . 'justlight.colorbox.js"></script>' .
				'<script>
				if(jQuery(".dataTable").length){
					var script	= document.createElement("script");
					script.type	= "text/javascript";
					script.src	= "' . WT_DATATABLES_BOOTSTRAP_JS_URL . '";
					document.body.appendChild(script);
					
					var newSheet = document.createElement("link");
					newSheet.setAttribute("href","' . WT_DATATABLES_BOOTSTRAP_CSS_URL . '");
					newSheet.setAttribute("type","text/css");
					newSheet.setAttribute("rel","stylesheet");
					newSheet.setAttribute("media","all");
					document.getElementsByTagName("head")[0].appendChild(newSheet);
				}
				</script>';
		} catch (Exception $ex) {
			return parent::hookFooterExtraJavascript();
		}
	}

	/** {@inheritdoc} */
	public function hookHeaderExtraContent() {
		try {
			$html = '';
			if (WT_SCRIPT_NAME == 'individual.php' || WT_Filter::get('mod_action') === 'treeview') {
				$html .= '<link rel="stylesheet" type="text/css" href="' . $this->assetUrl() . 'treeview.css">';
			}
			return $html;
		} catch (Exception $ex) {
			return parent::hookHeaderExtraContent();
		}
	}
	
	/** {@inheritdoc} */
	public function individualBoxMenuFamilyLinks(WT_Individual $individual) {
		try {
			foreach ($individual->getSpouseFamilies() as $family) {		
			$menus[] = '<li id="family-links"><a href="' . $family->getHtmlUrl() . '">' . WT_I18N::translate('Family with spouse') . '</a>';
			$menus[] = '<ul>';
			$spouse = $family->getSpouse($individual);
			if ($spouse && $spouse->canShowName()) {
				$menus[] = new WT_Menu($spouse->getFullName(), $spouse->getHtmlUrl());
			}
			foreach ($family->getChildren() as $child) {
				if ($child->canShowName()) {
					$menus[] = new WT_Menu($child->getFullName(), $child->getHtmlUrl());
				}
			}
			$menus[] = '</ul></li>';
		}

		return $menus;
			
		} catch (Exception $ex) {
			parent::individualBoxMenuFamilyLinks($individual);
		}
		$menus = array();		
	}

	/** {@inheritdoc} */
	public function logoPoweredBy() {
		try {
			return
				parent::logoPoweredBy() .
				'<a class="link" href="http://www.justcarmen.nl" target="_blank">Design: justcarmen.nl</a>';
		} catch (Exception $ex) {
			return parent::logoPoweredBy();
		}
	}

	private function menuCompact(WT_Individual $individual) {
		$menu = new WT_Menu(WT_I18N::translate('View'), '#', 'menu-view');

		$menu->addSubmenu($this->menuChart($individual));
		$menu->addSubmenu($this->menuLists());
		if ($this->themeOption('compact_menu_reports')) {
			$menu->addSubmenu($this->menuReports());
		}
		$menu->addSubmenu($this->menuCalendar());
		
		foreach ($menu->getSubmenus() as $submenu) {
			$id = explode("-", $submenu->getId());
			$new_id = implode("-", array($id[0], 'view', $id[1]));
			$submenu->setId($new_id);
		}

		return $menu;
	}

	public function menuLists() {
		try {
			$menu = parent::menuLists();
			if ($this->themeOption('media_menu')) {
				$submenus = array_filter($menu->getSubmenus(), function (WT_Menu $menu) {
					return $menu->getId() !== 'menu-list-obje';
				});
				$menu->setSubmenus($submenus);
			}
		} catch (Exception $ex) {
			return parent::menuLists();
		}
		return $menu;
	}

	public function menuLogin() {
		try {
			if (Auth::check() || $this->isSearchEngine()) {
				return null;
			} else {
				return
					'<div class="btn-group">' .
					'<a href="' . WT_LOGIN_URL . '?url=' . rawurlencode(get_query_url()) . '" class="btn btn-default">' .
					WT_I18N::translate('Login') .
					'</a></div>';
			}
		} catch (Exception $ex) {
			return parent::menuLogin();
		}
	}

	private function menuMedia() {
		global $MEDIA_DIRECTORY;

		$mainfolder = $this->themeOption('media_link') == $MEDIA_DIRECTORY ? '' : '&amp;folder=' . rawurlencode($this->themeOption('media_link'));
		$subfolders = $this->themeOption('subfolders') ? '&amp;subdirs=on' : '';

		$menu = new WT_Menu(/* I18N: Main media menu */ WT_I18N::translate('Media'), 'medialist.php?action=filter&amp;search=no' . $mainfolder . '&amp;sortby=title&amp;' . $subfolders . '&amp;max=20&amp;columns=2', 'menu-media');

		$folders = $this->themeOption('mediafolders'); $i = 0;
		foreach ($folders as $key => $folder) {
			if ($key !== $MEDIA_DIRECTORY) {
				$submenu = new WT_Menu(ucfirst($folder), 'medialist.php?action=filter&amp;search=no&amp;folder=' . rawurlencode($key) . '&amp;sortby=title&amp;' . $subfolders . '&amp;max=20&amp;columns=2', 'menu-media-' . $i);
				$menu->addSubmenu($submenu);
			}
			$i++;
		}
		return $menu;
	}

	/** (@inheritdoc) */
	public function menuMyAccount() {
		try {
			if (Auth::check()) {
				$menu = new WT_Menu(WT_I18N::translate('My account'), '');
				$menu->addSubmenu(new WT_Menu(WT_I18N::translate('My account'), 'edituser.php'));
				$menu->addSubmenu($this->menuLogout());
				return $menu;
			} else {
				return null;
			}
		} catch (Exception $ex) {
			return parent::menuMyAccount();
		}
	}
	
	private function mainContentStyle() {
		$page = array(
			'individual.php',
			'family.php',
			'medialist.php',
			WT_Filter::get('mod_action') === 'treeview',
		);

		if (in_array(WT_SCRIPT_NAME, $page)) {
			return 'style="width: 98%"';
		}
		
		if (WT_SCRIPT_NAME === 'pedigree.php') {
			return 'style="margin-bottom: 50px"';
		}
	}

	private function pageMedialist() {
		if (!$this->tree->getPreference('EXPAND_NOTES_DEFAULT')) {
			$this->tree->setPreference('EXPAND_NOTES_DEFAULT', $this->tree->getPreference('EXPAND_NOTES'));
		}

		if (WT_SCRIPT_NAME === 'medialist.php') {
			if ($this->tree->getPreference('EXPAND_NOTES')) {
				$this->tree->setPreference('EXPAND_NOTES', 0);
			}
		} else {
			$this->tree->setPreference('EXPAND_NOTES', $this->tree->getPreference('EXPAND_NOTES_DEFAULT'));
			$this->tree->setPreference('EXPAND_NOTES_DEFAULT', 0);
		}
	}
	
	/** {@inheritdoc} */
	public function parameter($parameter_name) {
		$parameters = array(
			'chart-background-f'             => 'fff0f5',
			'chart-background-m'             => 'd7eaf9',
			'chart-background-u'             => 'f9f9f9',
			'chart-box-x'                    => 280,
			'chart-box-y'                    => 90,
			'chart-descendancy-box-x'        => 280,
			'chart-descendancy-box-y'        => 90,
			'chart-font-color'               => '333333',
			'chart-font-size'                => 9,
			'distribution-chart-high-values' => '9ca3d4',
			'distribution-chart-low-values'  => 'e5e6ef',
			'line-width'                     => 2,
		);

		if (array_key_exists($parameter_name, $parameters)) {
			return $parameters[$parameter_name];
		} else {
			return parent::parameter($parameter_name);
		}
	}

	/** {@inheritdoc} */
	public function pendingChangesLink() {
		try {
			return
				'<a href="#" onclick="window.open(\'edit_changes.php\', \'_blank\', chan_window_specs); return false;">' .
				'<p class="alert alert-warning">' . $this->pendingChangesLinkText() . '</p>';
			'</a>';
		} catch (Exception $ex) {
			return parent::pendingChangesLink();
		}
	}

	/** {@inheritdoc} */
	public function primaryMenu() {
		try {
			global $controller;
			
			$menus = $this->themeOption('menu');
			if ($this->tree && $menus) {
				$individual = $controller->getSignificantIndividual();
				
				$modules = WT_Module::getActiveMenus();
				foreach ($menus as $menu) {
					$label = $menu['label'];
					$sort = $menu['sort'];
					$function = $menu['function'];
					if ($sort > 0) {
						if ($function == 'menuCompact') {
							$menubar[] = $this->menuCompact($individual);
						} elseif ($function == 'menuMedia') {
							$menubar[] = $this->menuMedia();
						} elseif ($function == 'menuChart') {
							$menubar[] = $this->menuChart($individual);
						} elseif ($function == 'menuModules') {
							$menubar[] = $modules[$label]->getMenu();
						} else {
							$menubar[] = $this->{$function}();
						}
					}
				}
				return array_filter($menubar);
			} else {
				return parent::primaryMenu();
			}
		} catch (Exception $ex) {
			return parent::primaryMenu();
		}
	}

	/** {@inheritdoc} */
	public function primaryMenuContainer(array $menus) {
		$html = '';
		foreach ($menus as $menu) {
			if($menu->getId() === 'menu-view') {
				$html .= $this->compactMenuContainer($menu);			
			} else {
				$html .= $menu->bootstrap();	
			}			
		}

		return
			'<div class="navbar-collapse collapse">' .
			'<nav class="navbar-text">' .
			'<ul class="nav nav-pills" role="tablist">' . $html . '</ul>' .
			'</nav></div>';
	}

	// This theme uses variables from php files in the javascript files
	private function scriptVars() {
		return '<script>' .
			'var WT_TREE_TITLE = "' . $this->tree->name() . '";' .
			'var JL_COLORBOX_URL = "' . $this->colorbox_url . '";' .
			'</script>';
	}

	/** (@inheritdoc) */
	public function secondaryMenu() {
		try {
			return array_filter(array(
				$this->menuFavorites(),
				$this->menuLanguages(),
				$this->menuThemes(),
				$this->menuMyAccount(),
			));
		} catch (Exception $ex) {
			return parent::secondaryMenu();
		}
	}

	/** (@inheritdoc) */
	public function secondaryMenuContainer(array $menus) {
		try {
			$html = '';
			foreach ($menus as $menu) {
				$html .= '<div class="btn-group">';
				$html .= '<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">';
				$html .= $menu->getLabel();
				$html .= '<span class="caret"></span>';
				$html .= '</button>';
				if ($menu->getsubmenus()) {
					$html .= '<ul class="dropdown-menu">';
					foreach ($menu->getsubmenus() as $submenu) {
						$html .= $submenu->getMenuAsList();
					}
					$html .= '</ul>';
				}
				$html .= '</div>';
			}
			return $html;
		} catch (Exception $ex) {
			return parent::secondaryMenuContainer($menus);
		}
	}

	/** {@inheritdoc} */
	public function stylesheets() {
		return array(
			WT_BOOTSTRAP_CSS_URL,
			$this->jquery_ui_url . 'jquery-ui.min.css',
			$this->colorbox_url . 'colorbox.css',
			$this->bootstrap_url . 'css/bootstrap-theme.min.css',
			$this->assetUrl() . 'style.css',
			$this->assetUrl() . 'justlight.css',
		);
	}

	/** {@inheritdoc} */
	public function themeId() {
		return 'justlight';
	}

	/** {@inheritdoc} */
	public function themeName() {
		return /* I18N: Name of a theme. */ WT_I18N::translate('JustLight');
	}

	// This theme comes with an optional module to set a few theme options
	private function themeOption($setting) {
		if (array_key_exists('justlight_theme_options', WT_Module::getActiveModules())) {
			$module = new justlight_theme_options_WT_Module;
			return $module->options($setting);
		}
	}

}

return new JustLightTheme;
