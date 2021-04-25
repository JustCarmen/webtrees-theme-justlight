<?php

/**
 * JustLight Theme
 *
 * JustCarmen webtrees modules
 * Copyright (C) 2014-2021 Carmen Pijpers-Knegt
 *
 * Based on webtrees: online genealogy
 * Copyright (C) 2021 webtrees development team
 *
 * This file is part of JustCarmen webtrees modules
 *
 * JustCarmen webtrees modules is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * JustCarmen webtrees modules is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with JustCarmen webtrees modules. If not, see <http://www.gnu.org/licenses/>.
 */

declare(strict_types=1);

namespace JustCarmen\WebtreesModules;

use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\View;
use Fisharebest\Webtrees\Session;
use Psr\Http\Message\ServerRequestInterface;
use Fisharebest\Webtrees\Module\MinimalTheme;
use Fisharebest\Webtrees\Module\ModuleThemeTrait;
use Fisharebest\Webtrees\Module\ModuleCustomTrait;
use Fisharebest\Webtrees\Module\ModuleFooterTrait;
use Fisharebest\Webtrees\Module\ModuleThemeInterface;
use Fisharebest\Webtrees\Module\ModuleCustomInterface;
use Fisharebest\Webtrees\Module\ModuleFooterInterface;
use Fisharebest\Webtrees\Module\ModuleGlobalInterface;
use Fisharebest\Webtrees\Module\ModuleGlobalTrait;

/**
 * Class JustLightTheme - Main class for JustLight Theme.
 */
return new class extends MinimalTheme implements ModuleThemeInterface, ModuleCustomInterface, ModuleFooterInterface, ModuleGlobalInterface
{
    use ModuleThemeTrait;
    use ModuleCustomTrait;
    use ModuleFooterTrait;
    use ModuleGlobalTrait;

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::title()
     */
    public function title(): string
    {
        return I18N::translate('JustLight');
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleAuthorName()
     */
    public function customModuleAuthorName(): string
    {
        return 'JustCarmen';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleVersion()
     *
     * We use a system where the version number is equal to the latest version of webtrees
     * Interim versions get an extra sub number
     *
     * The dev version is generally one step above the latest stable version of this module
     * The subsequent stable version depends on the version number of the latest stable version of webtrees
     *
     */
    public function customModuleVersion(): string
    {
        return '2.0.15-dev';
    }

    /**
     * A URL that will provide the latest stable version of this module.
     *
     * @return string
     */
    public function customModuleLatestVersionUrl(): string
    {
        return 'https://raw.githubusercontent.com/JustCarmen/webtrees-theme-justlight/master/latest-version.txt';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleSupportUrl()
     */
    public function customModuleSupportUrl(): string
    {
        return 'https://github.com/justcarmen/webtrees-theme-justlight/issues';
    }

    /**
     * A footer, to be added at the bottom of every page.
     *
     * @param ServerRequestInterface $request
     *
     * @return string
     */
    public function getFooter(ServerRequestInterface $request): string
    {
        if (Session::get('theme') === $this->name()) {
            return view($this->name() . '::theme/footer-credits', [
                'url' => 'https://justcarmen.nl',
                'text' => 'Design: justcarmen.nl'
            ]);
        } else {
            return "";
        }
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::boot()
     */
    public function boot(): void
    {
        // Register a namespace for our views.
        View::registerNamespace($this->name(), $this->resourcesFolder() . 'views/');

        // Add all javascript used by this module in a view
        View($this->name() . '::theme/script.js');

        // Replace an existing view with our own version.
        View::registerCustomView('::report-setup-page', $this->name() . '::report-setup-page');
        View::registerCustomView('::icons/add', $this->name() . '::icons/add');
        View::registerCustomView('::icons/anniversary', $this->name() . '::icons/anniversary');
        View::registerCustomView('::icons/calendar', $this->name() . '::icons/calendar');
        View::registerCustomView('::icons/delete', $this->name() . '::icons/delete');
        View::registerCustomView('::icons/individual', $this->name() . '::icons/individual');
        View::registerCustomView('::layouts/default', $this->name() . '::layouts/default');
        View::registerCustomView('::modules/clippings/show', $this->name() . '::modules/clippings/show');
        View::registerCustomView('::modules/faq/show', $this->name() . '::modules/faq/show');
        View::registerCustomView('::modules/favorites/favorites', $this->name() . '::modules/favorites/favorites');
        View::registerCustomView('::modules/gedcom_stats/statistics', $this->name() . '::modules/gedcom_stats/statistics');
        View::registerCustomView('::modules/stories/list', $this->name() . '::modules/stories/list');
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::resourcesFolder()
     */
    public function resourcesFolder(): string
    {
        return __DIR__ . '/resources/';
    }

    /**
     * Raw content, to be added at the end of the <head> element.
     * Typically, this will be <link> and <meta> elements.
     * we use it to load the special font files
     *
     * @return string
     */
    public function headContent(): string {

        return
            '<style>
            @font-face {
                font-family: \'icomoon\';
                src: url("' . $this->assetUrl('fonts/icomoon.eot') . '");
                src: url("' . $this->assetUrl('fonts/icomoon.eot') . ' #iefix") format("embedded-opentype"),
                    url("' . $this->assetUrl('fonts/icomoon.ttf') . '") format("truetype"),
                    url("' . $this->assetUrl('fonts/icomoon.woff') . '") format("woff"),
                    url("' . $this->assetUrl('fonts/icomoon.svg') . ' #icomoon") format("svg");
                font-weight: normal;
                font-style: normal;
                font-display: block;
            }
            </style>';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::stylesheets()
     */
    public function stylesheets(): array
    {
        return [
            $this->assetUrl('css/justlight.min.css')
        ];
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleThemeInterface::stylesheets()
     * Usage: FanChartModule and Statistics charts
     */
    public function parameter($parameter_name)
    {
        $parameters = [
            'chart-background-f'             => 'fff0f5', // FanChart
            'chart-background-m'             => 'd7eaf9', // Fanchart
            'chart-background-u'             => 'f9f9f9', // Fanchart
            'chart-box-x'                    => 260, // unused
            'chart-box-y'                    => 85, // unused
            'chart-font-color'               => '212529', // FanChart
            'chart-spacing-x'                => 5, // unused
            'chart-spacing-y'                => 10, // unused
            'compact-chart-box-x'            => 240, // unused
            'compact-chart-box-y'            => 50, // unused
            'distribution-chart-high-values' => 'fff0f5', // Statistics charts
            'distribution-chart-low-values'  => 'd7eaf9', // Statistics charts
            'distribution-chart-no-values'   => 'f9f9f9', // Statistics charts
        ];
        return $parameters[$parameter_name];
    }
};
