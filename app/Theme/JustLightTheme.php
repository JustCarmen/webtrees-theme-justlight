<?php
/**
 * JustLight theme for webtrees (online genealogy)
 * Copyright (C) 2018 JustCarmen (http://www.justcarmen.nl)
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
use Fisharebest\Webtrees\I18N;

class JustLightTheme extends JustBaseTheme {
	const THEME_VERSION = '2.0.0';
	const THEME_NAME    = 'JustLight';
	const THEME_DIR     = 'justlight';
	const ASSET_DIR     = 'themes/' . self::THEME_DIR . '/assets/';
	const STYLESHEET    = self::ASSET_DIR . 'css/style.css?v' . self::THEME_VERSION;
	const JAVASCRIPT    = self::ASSET_DIR . 'js/theme.js?v' . self::THEME_VERSION;

	public function menuMyPages() {
		$menu = parent::menuMyPages();
		if (Auth::id()) {
			$menu->addSubmenu($this->menuLogout());
		}
		return $menu;
	}

	/** (@inheritdoc) */
	public function secondaryMenu() {
		return array_filter([
		$this->menuMyPages(),
		$this->menuFavorites(),
		$this->menuThemes(),
		$this->menuLanguages(),
		$this->menuLogin()
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
						$attrs .= ' ' . $key . '="' . e($value) . '"';
					}

					$class = trim('dropdown-item ' . $submenu->getClass());
					$submenus .= '<a class="' . $class . '" href="' . $submenu->getLink() . '"' . $attrs . '>' . $submenu->getLabel() . '</a>';
				}

				$class = trim('nav-item dropdown ' . $menu->getClass());

				$html .= '<div class="' . $menu->getClass() . ' btn-group">' .
			'<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' .
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
					$attrs .= ' ' . $key . '="' . e($value) . '"';
				}

				$class = trim($menu->getClass() . ' btn-group');

				if ($menu->getClass() === 'menu-login') {
					$btn_class = 'btn-secondary';
				} else {
					$btn_class = 'btn-primary';
				}

				$html .= '<div class="' . $class . '"><a class="btn ' . $btn_class . '" href="' . $menu->getLink() . '"' . $attrs . '>' . $menu->getLabel() . '</a></li>';
			}
		}

		return $html;
	}

	/**
	 * In this theme we use full width pages on some pages
	 */
	public function setFluidClass() {
		$pages = ['individual'];

		if (in_array(Filter::get('route'), $pages)) {
			return '-fluid px-5'; // container-fluid
		}
	}

	/** {@inheritdoc} */
	public function themeName() {
		return /* I18N: Name of a theme. */ I18N::translate(self::THEME_NAME);
	}
}
