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
namespace JustCarmen\WebtreesThemes\JustLight;

use Composer\Autoload\ClassLoader;
use JustCarmen\WebtreesThemes\JustLight\Theme\JustLightTheme;

// load the theme classes
$loader = new ClassLoader();
$loader->addPsr4('JustCarmen\\WebtreesThemes\\JustLight\\', __DIR__ . '/app');
$loader->register();

return new JustLightTheme();
