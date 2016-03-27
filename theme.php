<?php
/**
 * JustLight Theme
 *
 * webtrees: online genealogy
 * Copyright (C) 2016 webtrees development team
 * Copyright (C) 2016 JustCarmen
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
namespace JustCarmen\WebtreesAddOns\JustLight;

use Fisharebest\Webtrees\Auth;
use Fisharebest\Webtrees\Filter;
use Fisharebest\Webtrees\FlashMessages;
use Fisharebest\Webtrees\Functions\Functions;
use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\Individual;
use Fisharebest\Webtrees\Menu;
use Fisharebest\Webtrees\Module;
use Fisharebest\Webtrees\Site;
use Fisharebest\Webtrees\Theme\AbstractTheme;
use Fisharebest\Webtrees\Theme\ThemeInterface;
use JustCarmen\WebtreesAddOns\FancyImagebar\FancyImagebarClass;

class JustLightTheme extends AbstractTheme implements ThemeInterface {

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
		return 'themes/justlight/css-1.7.4/';
	}

	/** {@inheritdoc} */
	public function bodyHeader() {
		return
			'<body>' .
			'<div id="wrap">' .
			'<header>' .
			'<div id="nav-container" class="navbar navbar-default navbar-fixed-top">' .
			'<div class="navbar-inner">' .
			'<div class="container-fluid">' .
			$this->formatNavbarToggle() .
			$this->headerContent() .
			$this->primaryMenuContainer($this->primaryMenu()) .
			'</div></div></div>' .
			'</header>' .
			'<div id="responsive"></div>' .
			$this->fancyImagebar() .
			$this->formatPendingChangesLink() .
			$this->flashMessagesContainer(FlashMessages::getMessages()) .
			'<main id="content" class="container"' . $this->mainContentStyle() . '>';
	}

	/** {@inheritdoc} */
	public function bodyHeaderPopupWindow() {
		if (Filter::get('action') === 'addnewnote_assisted') {
			$class = 'class="census-assistant"';
		} else {
			$class = '';
		}

		return
			'<body class="container container-popup">' .
			'<main id="content"' . $class . '">' .
			$this->flashMessagesContainer(FlashMessages::getMessages());
	}

	/** {@inheritdoc} */
	public function cookieWarning() {
		if (
			empty($_SERVER['HTTP_DNT']) &&
			empty($_COOKIE['cookie']) &&
			(Site::getPreference('GOOGLE_ANALYTICS_ID') || Site::getPreference('PIWIK_SITE_ID') || Site::getPreference('STATCOUNTER_PROJECT_ID'))) {
			$cookie_warning = '<div class="cookie-warning">' .
				I18N::translate('Cookies') . ' - ' .
				I18N::translate('This website uses cookies to learn about visitor behaviour.') .
				'</div>';
			return $this->htmlAlert($cookie_warning, 'info', true);
		} else {
			return '';
		}
	}

	public function formatCompactMenu($menu) {
		if ($menu->getSubmenus()) {
			$html = '<li class="' . $menu->getClass() . ' dropdown">';
			$html .= '<a class="dropdown-toggle" data-toggle="dropdown" href="#">' . $menu->getLabel() . '<span class="caret"></span></a>';
			$html .= '<ul class="dropdown-menu" role="menu">';
			foreach ($menu->getSubmenus() as $submenu) {
				if ($submenu->getSubmenus()) {
					$html .= '<li class="' . $submenu->getClass() . ' dropdown-submenu">';
					$html .= '<a class="dropdown-submenu-toggle" href="#">' . $submenu->getLabel() . '<span class="right-caret"></span></a>';

					$html .= '<ul class="dropdown-menu sub-menu">';
					foreach ($submenu->getSubmenus() as $subsubmenu) {
						$html .= $this->formatCompactMenuItem($subsubmenu);
					}
					$html .= '</ul></li>';
				} else {
					$html .= $this->formatCompactMenuItem($submenu);
				}
			}
			$html .= '</ul></li>';
		} else {
			$html .= $this->formatCompactMenuItem($menu);
		}
		return $html;
	}

	public function fancyImagebar() {
		if (Module::getModuleByName('fancy_imagebar')) {
			$fib = new FancyImagebarClass;
			if (method_exists($fib, 'loadFancyImagebar') && $fib->loadFancyImagebar()) {
				return $fib->getFancyImagebar();
			}
		}
	}

	protected function formatCompactMenuItem($menu) {
		$attrs = '';
		foreach ($menu->getAttrs() as $key => $value) {
			$attrs .= ' ' . $key . '="' . Filter::escapeHtml($value) . '"';
		}
		return
			'<li class="' . $menu->getClass() . '">' .
			'<a href="' . $menu->getLink() . '"' . $attrs . '>' . $menu->getLabel() . '</a>' .
			'</li>';
	}

	/** {@inheritdoc} */
	public function footerContainer() {
		return
			'</main>' .
			'<div id="push"></div>' .
			'</div>' .
			'<footer>' . $this->footerContent() . '</footer>' .
			'<div class="flash-messages">' . $this->cookieWarning() . '</div>';
	}

	/** {@inheritdoc} */
	public function footerContent() {
		return
			$this->formatContactLinks() .
			$this->formatPageViews($this->page_views) .
			'<div class="credits">' . $this->logoPoweredBy() . '</div>';
	}

	protected function formatNavbarToggle() {
		return
			'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' .
			'<span class="icon-bar"></span>' .
			'<span class="icon-bar"></span>' .
			'<span class="icon-bar"></span>' .
			'</button>';
	}

	/** {@inheritdoc} */
	public function formatPendingChangesLink() {
		if ($this->pendingChangesExist()) {
			return $this->htmlAlert($this->pendingChangesLink(), 'warning', true);
		} else {
			return '';
		}
	}

	/** {@inheritdoc} */
	public function formQuickSearch() {
		if ($this->tree) {
			return
				'<form action="search.php" class="header-search form-inline" role="search">' .
				'<input type="hidden" name="action" value="header">' .
				'<input type="hidden" name="ged" value="' . $this->tree->getNameHtml() . '">' .
				$this->formQuickSearchFields() .
				'</form>';
		} else {
			return '';
		}
	}

	/** {@inheritdoc} */
	public function formQuickSearchFields() {
		return
			'<div class="form-group">' .
			'<label class="sr-only" for="searc-basic">' . I18N::translate('Search') . '</label>' .
			'<input class="form-control" type="search" name="query" id="searc-basic" placeholder="' . I18N::translate('Search') . '" dir="auto" />' .
			'</div>' .
			'<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span></button>';
	}

	/** {@inheritdoc} */
	public function formatSecondaryMenu() {
		if (I18N::direction() === 'rtl') {
			$class = 'navbar-left';
		} else {
			$class = 'navbar-right';
		}

		return
			'<div class="' . $class . '">' .
			$this->secondaryMenuContainer($this->secondaryMenu()) .
			$this->menuLogin() .
			'</div>';
	}

	/** {@inheritdoc} */
	public function formatTreeTitle() {
		if ($this->tree) {
			return
				'<h1>' .
				'<a href="index.php" class="navbar-brand" style="' . $this->headerTitleStyle() . '">' . $this->tree->getTitleHtml() . '</a>' .
				'</h1>';
		} else {
			return '';
		}
	}

	/** {@inheritdoc} */
	public function headerContent() {
		return
			'<div class="navbar-header">' .
			$this->formatTreeTitle() .
			'</div>' .
			'<div class="navbar-collapse collapse navbar-top">' .
			'<div class="div_search">' . $this->formQuickSearch() . '</div>' .
			$this->formatSecondaryMenu() .
			'</div>';
	}

	// Theme setting for the tree title
	protected function headerTitleStyle() {
		return 'font-size:' . $this->themeOption('titlesize') . 'px;';
	}

	/** {@inheritdoc} */
	public function hookAfterInit() {
		// Put a version number in the URL, to prevent browsers from caching old versions.
		$this->theme_dir	 = 'themes/justlight/';
		$this->js_url		 = 'themes/justlight/js-1.7.4/';
		$this->bootstrap_url = $this->theme_dir . 'bootstrap-3.3.6/';
		$this->jquery_ui_url = $this->theme_dir . 'jquery-ui-1.11.4/';
		$this->colorbox_url	 = $this->theme_dir . 'colorbox-1.5.14/';
	}

	/** {@inheritdoc} */
	public function hookFooterExtraJavascript() {
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
	}

	/** {@inheritdoc} */
	public function hookHeaderExtraContent() {
		$html = '';
		if (WT_SCRIPT_NAME == 'individual.php' || Filter::get('mod_action') === 'treeview') {
			$html .= '<link rel="stylesheet" type="text/css" href="' . $this->assetUrl() . 'treeview.css">';
		}
		return $html;
	}

	/** {@inheritdoc} */
	public function individualBoxMenuFamilyLinks(Individual $individual) {
		$menus = array();
		foreach ($individual->getSpouseFamilies() as $family) {
			$menus[] = '<li class="family-links"><a href="' . $family->getHtmlUrl() . '">' . I18N::translate('Family with spouse') . '</a>';
			$menus[] = '<ul>';
			$spouse	 = $family->getSpouse($individual);
			if ($spouse && $spouse->canShowName()) {
				$menus[] = new Menu($spouse->getFullName(), $spouse->getHtmlUrl());
			}
			foreach ($family->getChildren() as $child) {
				if ($child->canShowName()) {
					$menus[] = new Menu($child->getFullName(), $child->getHtmlUrl());
				}
			}
			$menus[] = '</ul></li>';
		}

		return $menus;
	}

	/** {@inheritdoc} */
	public function logoPoweredBy() {
		return
			parent::logoPoweredBy() .
			'<a class="link" href="http://www.justcarmen.nl" target="_blank">Design: justcarmen.nl</a>';
	}

	protected function mainContentStyle() {
		$page = array(
			'individual.php',
			'family.php',
			'medialist.php',
			Filter::get('mod_action') === 'treeview',
		);

		if (in_array(WT_SCRIPT_NAME, $page)) {
			return 'style="width: 98%"';
		}

		if (WT_SCRIPT_NAME === 'pedigree.php') {
			return 'style="margin-bottom: 50px"';
		}
	}

	protected function menuCompact(Individual $individual, $surname) {
		$menu = new Menu(I18N::translate('View'), '#', 'menu-view');

		$menu->addSubmenu($this->menuChart($individual));
		$menu->addSubmenu($this->menuLists($surname));

		/** $menuReports could return null */
		if ($this->themeOption('compact_menu_reports') && $this->menuReports()) {
			$menu->addSubmenu($this->menuReports());
		}

		$menu->addSubmenu($this->menuCalendar());

		foreach ($menu->getSubmenus() as $submenu) {
			$class		 = explode("-", $submenu->getClass());
			$new_class	 = implode("-", array($class[0], 'view', $class[1]));
			$submenu->setClass($new_class);
		}

		return $menu;
	}

	public function menuFavorites() {
		$menu = parent::menuFavorites();
		if ($menu && count($menu->getSubmenus())) {
			return $menu;
		} else {
			return null;
		}
	}

	public function menuLists($surname) {
		$menu = parent::menuLists($surname);
		if ($this->themeOption('media_menu')) {
			$submenus = array_filter($menu->getSubmenus(), function (Menu $menu) {
				return $menu->getClass() !== 'menu-list-obje';
			});
			$menu->setSubmenus($submenus);
		}
		return $menu;
	}

	public function menuLogin() {
		if (Auth::check() || Auth::isSearchEngine()) {
			return null;
		} else {
			return
				'<div class="menu-login btn-group">' .
				'<a href="' . WT_LOGIN_URL . '?url=' . rawurlencode(Functions::getQueryUrl()) . '" class="btn btn-default">' .
				I18N::translate('Login') .
				'</a></div>';
		}
	}

	protected function menuMedia() {
		$MEDIA_DIRECTORY = $this->tree->getPreference('MEDIA_DIRECTORY');

		$folders		 = $this->themeOption('mediafolders');
		$show_subfolders = $this->themeOption('show_subfolders') ? '&amp;subdirs=on' : '';

		if (count($folders) > 1) {
			$menu = new Menu(/* I18N: Main media menu */ I18N::translate('Media'), '', 'menu-media');

			foreach ($folders as $key => $folder) {
				if ($key !== $MEDIA_DIRECTORY) {
					$submenu = new Menu(ucfirst($folder), 'medialist.php?' . $this->tree_url . '&amp;action=filter&amp;search=no&amp;folder=' . Filter::escapeUrl($key) . '&amp;sortby=title' . $show_subfolders . '&amp;max=20&amp;columns=2&amp;action=submit', 'menu-mediafolder');
					$menu->addSubmenu($submenu);
				}
			}
		} else { // fallback if we don't have any subfolders added to the list
			$menu = new Menu(/* I18N: Main media menu */ I18N::translate('Media'), 'medialist.php?' . $this->tree_url, 'menu-media');
		}
		return $menu;
	}

	protected function menuModule($module_name) {
		$modules = Module::getActiveMenus($this->tree);
		if (array_key_exists($module_name, $modules)) {
			return $modules[$module_name]->getMenu();
		} else {
			return null;
		}
	}

	public function menuMyPages() {
		$menu = parent::menuMyPages();
		if (Auth::id()) {
			$menu->addSubmenu($this->menuLogout());
		}
		return $menu;
	}

	/** {@inheritdoc} */
	public function parameter($parameter_name) {
		$parameters = array(
			'chart-background-f'			 => 'fff0f5',
			'chart-background-m'			 => 'd7eaf9',
			'chart-background-u'			 => 'f9f9f9',
			'chart-box-x'					 => 280,
			'chart-box-y'					 => 90,
			'chart-font-color'				 => '333333',
			'distribution-chart-high-values' => '9ca3d4',
			'distribution-chart-low-values'	 => 'e5e6ef',
			'line-width'					 => 2,
		);

		if (WT_SCRIPT_NAME === 'pedigree.php' && (Filter::getInteger('orientation') === 2 || Filter::getInteger('orientation') === 3)) {
			$parameters['compact-chart-box-x']	 = 105;
			$parameters['compact-chart-box-y']	 = 140;
		}

		if (array_key_exists($parameter_name, $parameters)) {
			return $parameters[$parameter_name];
		} else {
			return parent::parameter($parameter_name);
		}
	}

	/** {@inheritdoc} */
	public function primaryMenu() {
		global $controller;

		$menus = $this->themeOption('menu');
		if ($this->tree && $menus) {
			$individual	 = $controller->getSignificantIndividual();
			$surname	 = $controller->getSignificantSurname();
			foreach ($menus as $menu) {
				$label		 = $menu['label'];
				$sort		 = $menu['sort'];
				$function	 = $menu['function'];
				if ($sort > 0) {
					if ($function === 'menuCompact') {
						$menubar[] = $this->menuCompact($individual, $surname);
					} elseif ($function === 'menuMedia') {
						$menubar[] = $this->menuMedia();
					} elseif ($function === 'menuChart') {
						$menubar[] = $this->menuChart($individual);
					} elseif ($function === 'menuLists') {
						$menubar[] = $this->menuLists($surname);
					} elseif ($function === 'menuModule') {
						$menubar[] = $this->menuModule($label);
					} else {
						$menubar[] = $this->{$function}();
					}
				}
			}
			return array_filter($menubar);
		} else {
			return parent::primaryMenu();
		}
	}

	/** {@inheritdoc} */
	public function primaryMenuContainer(array $menus) {
		return
			'<div class="navbar-collapse collapse">' .
			'<nav class="navbar-text">' .
			'<ul class="nav nav-pills" role="tablist">' . $this->primaryMenuContent($menus) . '</ul>' .
			'</nav></div>';
	}

	/** {@inheritdoc} */
	public function primaryMenuContent(array $menus) {
		$_this = $this;
		return implode('', array_map(function (Menu $menu) use ($_this) {
				if ($menu->getClass() === 'menu-view') {
					return $_this->formatCompactMenu($menu);
				} else {
					return $menu->bootstrap();
				}
			}, $menus));
	}

	// This theme uses variables from php files in the javascript files
	protected function scriptVars() {
		if ($this->tree) {
			$tree_title = $this->tree->getName();
		} else {
			$tree_title = '';
		}

		return '<script>' .
			'var WT_BASE_URL = "' . WT_BASE_URL . '";' .
			'var WT_TREE_TITLE = "' . $tree_title . '";' .
			'var JL_COLORBOX_URL = "' . $this->colorbox_url . '";' .
			'var TEXT_PREV = "' . I18N::translate('previous') . '";' .
			'var TEXT_NEXT = "' . I18N::translate('next') . '";' .
			'</script>';
	}

	/** (@inheritdoc) */
	public function secondaryMenu() {
		return array_filter(array(
			$this->menuMyPages(),
			$this->menuFavorites(),
			$this->menuThemes(),
			$this->menuLanguages()
		));
	}

	/** (@inheritdoc) */
	public function secondaryMenuContainer(array $menus) {
		$html = '';
		foreach ($menus as $menu) {
			$html .= '<div class="' . $menu->getClass() . ' btn-group">';
			$html .= '<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">';
			$html .= $menu->getLabel();
			$html .= '<span class="caret"></span>';
			$html .= '</button>';
			if ($menu->getsubmenus()) {
				$html .= '<ul class="dropdown-menu">';
				foreach ($menu->getsubmenus() as $submenu) {
					if ($submenu->getClass() === 'menu-logout') {
						$html .= '<li role="separator" class="divider"></li>';
					}
					$html .= $submenu->getMenuAsList();
				}
				$html .= '</ul>';
			}
			$html .= '</div>';
		}
		return $html;
	}

	/** {@inheritdoc} */
	public function stylesheets() {
		$stylesheets = array(
			$this->jquery_ui_url . 'jquery-ui.min.css',
			$this->colorbox_url . 'colorbox.css',
			$this->bootstrap_url . 'css/bootstrap-theme.min.css',
			$this->assetUrl() . 'style.css',
			$this->assetUrl() . 'justlight.css'
		);
		return array_merge(parent::stylesheets(), $stylesheets);
	}

	/** {@inheritdoc} */
	public function themeId() {
		return 'justlight';
	}

	/** {@inheritdoc} */
	public function themeName() {
		return /* I18N: Name of a theme. */ I18N::translate('JustLight');
	}

	// This theme comes with an optional module to set a few theme options
	protected function themeOption($setting) {
		if (Module::getModuleByName('justlight_theme_options')) {
			$module = new JustLightThemeOptionsClass;
			return $module->options($setting);
		}
	}

}

return new JustLightTheme;
