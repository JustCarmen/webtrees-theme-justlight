<?php
/**
 * JustLight Theme
 *
 * webtrees: online genealogy
 * Copyright (C) 2017 webtrees development team
 * Copyright (C) 2017 JustCarmen
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
namespace JustCarmen\WebtreesThemes\JustLight\Theme;

use Fisharebest\Webtrees\Auth;
use Fisharebest\Webtrees\Filter;
use Fisharebest\Webtrees\FlashMessages;
use Fisharebest\Webtrees\Html;
use Fisharebest\Webtrees\I18N;

class JustLightTheme extends JustBaseTheme {

  const THEME_VERSION = '2.0.0';
  const THEME_NAME    = 'JustLight';
  const THEME_DIR     = 'justlight';
  const ASSET_DIR     = 'themes/' . self::THEME_DIR . '/css/';
  const STYLESHEET    = self::ASSET_DIR . 'style.css?v' . self::THEME_VERSION;
  const JAVASCRIPT    = 'themes/' . self::THEME_DIR . '/js/theme.js?v' . self::THEME_VERSION;

  /** {@inheritdoc} */
  public function bodyHeader() {
    return
        '<body class="wt-global' . $this->getPageGlobalClass() . ' theme-' . self::THEME_DIR . '">' .
        '<header class="wt-header-wrapper px-5 mb-3">' .
        '<div class="wt-header-container">' .
        '<div class="row wt-header-content mb-3">' .
        $this->headerContent() .
        '</div>' .
        '</div>' .
        $this->primaryMenuContainer($this->primaryMenu()) .
        '</header>' .
        $this->fancyImagebar() .
        '<main id="content" class="container' . $this->setFluidClass() . ' wt-main-wrapper mt-3">' .
        '<div class="wt-main-container">' .
        $this->flashMessagesContainer(FlashMessages::getMessages());
  }

  /** {@inheritdoc} */
  public function formatTreeTitle() {
    if ($this->tree) {
      return
          '<h1 class="col wt-site-title">' . $this->formatTreeTitleLink() . '</h1>';
    } else {
      return '';
    }
  }

  /** {@inheritdoc} */
  protected function headerContent() {
    return
        $this->accessibilityLinks() .
        '<div class="d-flex col-12 col-lg-6 order-2 order-lg-1 mt-3">' .
        $this->logoHeader() .
        $this->formatTreeTitle() .
        '</div>' .
        '<div class="jc-secondary-navigation d-flex flex-row flex-nowrap col-12 col-lg-6 order-1 order-lg-2 justify-content-sm-start justify-content-md-end align-items-start">' .
        '<div class="wt-secondary-menu d-flex">' .
        $this->secondaryMenuContainer($this->secondaryMenu()) .
        '</div>' .
        $this->formQuickSearch() .
        '</div>';
  }

  public function menuMyPages() {
    $menu = parent::menuMyPages();
    if (Auth::id()) {
      $menu->addSubmenu($this->menuLogout());
    }
    return $menu;
  }

  /**
   * Do not use the default class 'col wt-primary navigation' here.
   * It causes an horizontal overflow in our design
   *
   * {@inheritdoc}
   */
  protected function primaryMenuContainer(array $menus) {
    return '<nav class="jc-primary-navigation px-0"><ul class="nav nav-pills wt-primary-menu justify-content-start">' . $this->primaryMenuContent($menus) . '</ul></nav>';
  }

  /** (@inheritdoc) */
  public function secondaryMenu() {
    return array_filter([
        $this->menuMyPages(),
        $this->menuFavorites(),
        $this->menuThemes(),
        $this->menuLanguages()
    ]);
  }

  /**
   * Render this menu using Bootstrap4 markup
   * We use buttons in stead of links in this theme
   *
   * @return string
   */
  public function secondaryMenuContainer(array $menus) {
    $html = '';
    foreach ($menus as $menu) {
      if ($menu->getSubmenus()) {
        $submenus = '';
        foreach ($menu->getSubmenus() as $submenu) {
          $attrs = '';
          foreach ($submenu->getAttrs() as $key => $value) {
            $attrs .= ' ' . $key . '="' . Html::escape($value) . '"';
          }

          $class    = trim('dropdown-item ' . $submenu->getClass());
          $submenus .= '<a class="' . $class . '" href="' . $submenu->getLink() . '"' . $attrs . '>' . $submenu->getLabel() . '</a>';
        }

        $class = trim('nav-item dropdown ' . $menu->getClass());

        $html .= '<div class="' . $menu->getClass() . ' btn-group">' .
            '<button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' .
            '<span class="menu-label">' . $menu->getLabel() . '</span>' .
            '<i class="caret"></i>' .
            '</button>' .
            '<div class="dropdown-menu" role="menu">' .
            $submenus .
            '</div>' .
            '</div>';
      } else {
        $attrs = '';
        foreach ($menu->getAttrs() as $key => $value) {
          $attrs .= ' ' . $key . '="' . Html::escape($value) . '"';
        }

        $class = trim('nav-item btn-group ' . $menu->getClass());

        $html .= '<div class="' . $class . '"><button class="btn btn-sm btn-primary" href="' . $menu->getLink() . '"' . $attrs . '>' . $menu->getLabel() . '</a></li>';
      }
    }

    return $html;
  }

  /**
   * In this theme we use full width pages on some pages
   */
  protected function setFluidClass() {
    $pages   = ['individual'];
    $modules = ['tree'];

    if (in_array($this->getPage(), $pages) || (in_array(Filter::get('mod'), $modules))) {
      return '-fluid px-5'; // container-fluid
    }
  }

  /** @inheritdoc} */
  public function stylesheets() {
    return array_merge(
      parent::stylesheets(), [self::STYLESHEET]
    );
  }

  /** {@inheritdoc} */
  public function themeName() {
    return /* I18N: Name of a theme. */ I18N::translate(self::THEME_NAME);
  }

}
