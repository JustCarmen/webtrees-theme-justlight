<?php
/**
 * webtrees: online genealogy
 * Copyright (C) 2017 JustCarmen (http://www.justcarmen.nl)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
namespace JustCarmen\WebtreesThemes\JustLight\Theme;

use Fisharebest\Webtrees\Auth;
use Fisharebest\Webtrees\Filter;
use Fisharebest\Webtrees\Html;
use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\Individual;
use Fisharebest\Webtrees\Menu;
use Fisharebest\Webtrees\Module;
use Fisharebest\Webtrees\Theme\MinimalTheme;
use JustCarmen\WebtreesAddOns\FancyImagebar\FancyImagebarClass;

class JustBaseTheme extends MinimalTheme {

  const THEME_VERSION = '2.0.0-dev';
  const DESIGNER_URL  = 'http://www.justcarmen.nl';

  protected function bodyHeaderEnd() {
    return '</div></main>';
  }
  
  /**
   * Url to the homepage of the designer of this theme
   * @return type
   */
  private function designerUrl() {
    return '<a href="' . self::DESIGNER_URL . '" title="' . self::DESIGNER_URL . '">Design: justcarmen.nl</a>';
  }

  /**
   * Load the Fancy Imagebar from the theme - quickest way to load the imagebar.
   * We do not have to wait until the page is fully loaded
   *
   * @return type
   */
  public function fancyImagebar() {
    if (Module::getModuleByName('fancy_imagebar')) {
      $fib = new FancyImagebarClass;
      if (method_exists($fib, 'loadFancyImagebar') && $fib->loadFancyImagebar()) {
        return $fib->getFancyImagebar();
      }
    }
  }

  /** {@inheritdoc} */
  public function footerContainer() {
    return
        $this->bodyHeaderEnd() .
        '<footer class="wt-footer-container bg-faded py-3">' . $this->footerContent() . '</footer>' .
        '<div class="flash-messages">' . $this->formatCookieWarning() . '</div>';
  }

  /** {@inheritdoc} */
  public function footerContent() {
    return
        '<div class="jc-footer-content d-flex align-items-end">' .
        $this->formatContactLinks() .
        $this->formatPageViews($this->page_views) .
        $this->formatCredits() .
        '</div>';
  }

  /** {@inheritdoc} */
  protected function formatContactLinks() {
    return '<div class="jc-footer-item col-md-4 text-left">' . parent::formatContactLinks() . '</div>';
  }

  protected function formatCookieWarning() {
    if ($this->cookieWarning()) {
      return $this->htmlAlert($this->cookieWarning(), 'info', true);
    }
  }

  protected function formatCredits() {
    return
        '<div class="jc-footer-item col-md-4 text-right">' .
        '<div class="credits d-flex flex-column">' . $this->logoPoweredBy() .
        $this->designerUrl() .
        '</div></div>';
  }

  public function formatMultilevelMenu($menu) {
    if ($menu->getSubmenus()) {
      $html = '<li class="nav-item' . $menu->getClass() . ' dropdown">';
      $html .= '<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">' . $menu->getLabel() . '<span class="caret"></span></a>';
      $html .= '<ul class="dropdown-menu" role="menu">';
      foreach ($menu->getSubmenus() as $submenu) {
        if ($submenu->getSubmenus()) {
          $html .= '<li class="' . $submenu->getClass() . ' dropdown-submenu">';
          $html .= '<a class="dropdown-submenu-toggle" href="#">' . $submenu->getLabel() . '<span class="right-caret"></span></a>';

          $html .= '<ul class="dropdown-menu sub-menu">';
          foreach ($submenu->getSubmenus() as $subsubmenu) {
            $html .= $this->formatMultilevelMenuItem($subsubmenu);
          }
          $html .= '</ul></li>';
        } else {
          $html .= $this->formatMultilevelMenuItem($submenu);
        }
      }
      $html .= '</ul></li>';
    } else {
      $html .= $this->formatMultilevelMenuItem($menu);
    }
    return $html;
  }

  protected function formatMultilevelMenuItem(Menu $menu) {
    $attrs = '';
    foreach ($menu->getAttrs() as $key => $value) {
      $attrs .= ' ' . $key . '="' . Html::escape($value) . '"';
    }
    return
        '<li class="' . $menu->getClass() . '">' .
        '<a href="' . $menu->getLink() . '"' . $attrs . '>' . $menu->getLabel() . '</a>' .
        '</li>';
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
  protected function formatPageViews($count) {
    return '<div class="jc-footer-item col-md-4 text-center">' . parent::formatPageViews($count) . '</div>';
  }

  /**
   * Create a quick search icon to use in small devices.
   *
   * @return string
   */
  protected function formatQuickSearchIcon() {
    if ($this->tree) {
      return
          '<li class="nav-item quick-search-small d-lg-none align-self-center">' .
          '<a class="nav-link fa fa-search" href="search.php?ged=' . $this->tree->getName() . '"></a>' .
          '</li>';
    } else {
      return '';
    }
  }

  /**
   * Format a clickable tree title link
   *
   * @return type
   */
  protected function formatTreeTitleLink() {
    return '<a href="index.php?ctype=gedcom&ged=' . $this->tree->getName() . '">' . $this->tree->getTitleHtml() . '</a>';
  }

  /** Get list page
	 * We need an identifier for list pages for styling purposes
	 *
	 */
	protected function getListPages() {
		$lists = [
			'famlist',
			'indilist',
			'repolist',
			'notelist',
			'sourcelist',
		];

		return $lists;
	}

  /**
   * Add page identifier to the main content class
   *
   * @return string
   */
  protected function getPageGlobalClass() {
    $class = ' jc-global-' . $this->getPage();

    $module = Filter::get('mod');
    if ($module) {
      $class .= '-' . $module;
    }

    $ctype = Filter::get('ctype');
    if ($ctype) {
      $class .= $class . '-' . $ctype;
    }

    if (in_array($this->getPage(), $this->getListPages())) {
      $class .= ' jc-global-listpage';
    }
    return $class;
  }

  /**
   * Get the current page
   *
   * @return type
   */
  protected function getPage() {
    return basename(WT_SCRIPT_NAME, ".php");
  }

  /** {@inheritdoc} */
  public function hookFooterExtraJavascript() {
    return
        $this->PhpToJavascript($this->hookJavascriptVariables()) .
        '<script src="' . WT_JQUERY_COLORBOX_URL . '"></script>' .
        '<script src="' . WT_JQUERY_WHEELZOOM_URL . '"></script>' .
        '<script src="' . static::JAVASCRIPT . '"></script>';
  }

  /**
   * This theme uses variables from php in javascript.
   * Output an array of variables
   * Key	 = Javascript variable name
   * Value = Php value
   *
   * @return array
   *
   */
  protected function hookJavascriptVariables() {
    $variables = [
        'AUTH_ID'              => Auth::id(),
        'COLORBOX_ACTION_FILE' => self::THEME_DIR . 'colorbox/action.php',
        'WT_BASE_URL'          => WT_BASE_URL
    ];

    return $variables;
  }

  /**
   * {@inheritdoc}
	 * Display an individual in a box - for charts, etc.
	 *
	 * @param Individual $individual
   * We need an extra div to use a flexbox layout
	 *
	 * @return string
	 */
	public function individualBox(Individual $individual) {
		$personBoxClass = array_search($individual->getSex(), ['person_box' => 'M', 'person_boxF' => 'F', 'person_boxNN' => 'U']);
		if ($individual->canShow() && $individual->getTree()->getPreference('SHOW_HIGHLIGHT_IMAGES')) {
			$thumbnail = $individual->displayImage(40, 50, 'crop', []);
		} else {
			$thumbnail = '';
		}

		$content = '<span class="namedef name1">' . $individual->getFullName() . '</span>';
		$icons   = '';
		if ($individual->canShow()) {
			$content =        
				'<a href="' . $individual->getHtmlUrl() . '">' . $content . '</a>' .
				'<div class="namedef name1">' . $individual->getAddName() . '</div>';
			$icons   =
				'<div class="icons order-2">' .
				'<span class="iconz icon-zoomin" title="' . I18N::translate('Zoom in/out on this box.') . '"></span>' .
				'<div class="itr"><i class="icon-pedigree"></i><div class="popup">' .
				'<ul class="' . $personBoxClass . '">' . implode('', array_map(function(Menu $menu) { return $menu->bootstrap4(); }, $this->individualBoxMenu($individual))) . '</ul>' .
				'</div>' .
				'</div>' .
				'</div>';
		}

		return
			'<div data-pid="' . $individual->getXref() . '" class="person_box_template ' . $personBoxClass . ' box-style1 d-flex" style="width: ' . $this->parameter('chart-box-x') . 'px; height: ' . $this->parameter('chart-box-y') . 'px">' .
			$icons .
			'<div class="chart_textbox d-flex order-1" style="max-height:' . $this->parameter('chart-box-y') . 'px;">' .
			$thumbnail .
      '<div class="d-flex flex-column">' .
			$content .
			'<div class="inout2 details1">' . $this->individualBoxFacts($individual) . '</div>' .
      '</div>' .
			'</div>' .
			'<div class="inout"></div>' .
			'</div>';
	}

  /** {@inheritdoc} */
  protected function logoPoweredBy() {
    return '<a href="' . WT_WEBTREES_URL . '" class="wt-powered-by-webtrees" title="' . WT_WEBTREES_URL . '" dir="ltr"></a>';
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
      $class     = explode("-", $submenu->getClass());
      $new_class = implode("-", [$class[0], 'view', $class[1]]);
      $submenu->setClass($new_class);
    }

    return $menu;
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

  /**
   * {@inheritdoc}
   *
   * Part of list menu
   */
  protected function menuListsMedia() {
    return new Menu(I18N::translate('Media objects'), 'medialist.php?' . $this->tree_url . '&amp;action=filter&amp;search=no&amp;folder=&amp;sortby=title&amp;subdirs=on&amp;max=20&amp;columns=2&amp;action=submit', 'menu-list-obje', ['rel' => 'nofollow']);
  }

  protected function menuMedia() {
    $resns = $this->tree->getFactPrivacy();
    if (isset($resns['OBJE'])) {
      $resn = $resns['OBJE'];
    } else {
      $resn = Auth::PRIV_PRIVATE;
    }

    if ($resn >= Auth::accessLevel($this->tree)) {

      $MEDIA_DIRECTORY = $this->tree->getPreference('MEDIA_DIRECTORY');

      $folders         = $this->themeOption('mediafolders');
      $show_subfolders = $this->themeOption('show_subfolders') ? '&amp;subdirs=on' : '';

      if (count($folders) > 1) {
        $menu = new Menu(/* I18N: Main media menu */ I18N::translate('Media'), '', 'menu-media');

        $submenu = new Menu(I18N::translate('Media'), 'medialist.php?' . $this->tree_url . '&amp;action=filter&amp;search=no&amp;folder=&amp;sortby=title' . $show_subfolders . '&amp;max=20&amp;columns=2&amp;action=submit', 'menu-media-all');
        $menu->addSubmenu($submenu);

        // divider
        $divider = new Menu('', '#', 'menu-media-divider divider');
        $menu->addSubmenu($divider);

        foreach ($folders as $key => $folder) {
          if ($key !== $MEDIA_DIRECTORY) {
            $submenu = new Menu(ucfirst($folder), 'medialist.php?' . $this->tree_url . '&amp;action=filter&amp;search=no&amp;folder=' . rawurlencode($key) . '&amp;sortby=title' . $show_subfolders . '&amp;max=20&amp;columns=2&amp;action=submit', 'menu-media-' . preg_replace('/[^A-Za-z0-9\. -]/', '', str_replace(" ", "-", $folder)));
            $menu->addSubmenu($submenu);
          }
        }
      } else { // fallback if we don't have any subfolders added to the list
        $menu = new Menu(/* I18N: Main media menu */ I18N::translate('Media'), 'medialist.php?' . $this->tree_url . '&amp;sortby=title&amp;max=20&amp;columns=2&amp;action=submit', 'menu-media');
      }
      return $menu;
    }
  }

  protected function menuModule($module_name) {
    $modules = Module::getActiveMenus($this->tree);
    if (array_key_exists($module_name, $modules)) {
      return $modules[$module_name]->getMenu();
    } else {
      return null;
    }
  }

  /**
   * Output Javascript variables from Php values
   *
   * @param array $variables
   * @return javascript
   */
  protected function phpToJavascript(array $variables) {
    $javascript = '';
    foreach ($variables as $js_variable => $php_variable) {
      $javascript .= 'var ' . $js_variable . ' = "' . $php_variable . '"; ';
    }

    return '<script>' . $javascript . '</script>';
  }

  /** {@inheritdoc} */
  public function primaryMenu() {
    global $controller;

    $menus = $this->themeOption('menu');
    if ($this->tree && $menus) {
      $individual = $controller->getSignificantIndividual();
      $surname    = $controller->getSignificantSurname();
      foreach ($menus as $menu) {
        $label    = $menu['label'];
        $sort     = $menu['sort'];
        $function = $menu['function'];
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
  public function primaryMenuContent(array $menus) {
    $_this = $this; // workaround for php 5.3
    return implode('', array_map(function (Menu $menu) use ($_this) {

          $is_multilevel_menu = false;
          foreach ($menu->getsubMenus() as $submenu) {
            if ($submenu->getSubmenus()) {
              $is_multilevel_menu = true;
              break;
            }
          }

          if ($is_multilevel_menu) {
            return $_this->formatMultilevelMenu($menu);
          } else {
            return $menu->bootstrap4();
          }
        }, $menus));
  }
  
  /**
   * Format the secondary menu.
   *
   * @param Menu[] $menus
   *
   * @return string
   */
  protected function secondaryMenuContent(array $menus) {
    return
        parent::secondaryMenuContent($menus) .
        $this->formatQuickSearchIcon();
  }

  /**
   * Remove the bootstrap css.
   * We will implement a modified version into this theme
   *
   * {@inheritdoc}
   */
  public function stylesheets() {
    return array_merge(
      array_diff(parent::stylesheets(), [WT_BOOTSTRAP_CSS_URL])
    );
  }

  // Fancy Themes options module
  protected function themeOption($setting) {
    if (Module::getModuleByName('fancy_theme_options')) {
      $module = new FancyThemeOptionsClass;
      return $module->options($setting);
    }
  }

}
