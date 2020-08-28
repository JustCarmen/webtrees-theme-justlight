<?php

/**
 * JustLight Theme
 * 
 * JustCarmen webtrees modules
 * Copyright (C) 2009-2020 Carmen Pijpers-Knegt
 * 
 * Based on webtrees: online genealogy
 * Copyright (C) 2020 webtrees development team
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

/**
 * Class JustLightTheme - Main class for JustLight Theme.
 */
return new class extends MinimalTheme implements ModuleThemeInterface, ModuleCustomInterface, ModuleFooterInterface
{
    use ModuleThemeTrait;
    use ModuleCustomTrait;
    use ModuleFooterTrait;

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
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::stylesheets()
     */
    public function stylesheets(): array
    {
        return [
            route('module', ['module' => $this->name(), 'action' => 'Stylesheet']),
            $this->assetUrl('css/justlight.min.css')

        ];
    }

    function getStylesheetAction()
    {
        $response = view($this->name() . '::theme/style.css', [
            'eot_url'   => $this->assetUrl('fonts/icomoon.eot'),
            'svg_url'   => $this->assetUrl('fonts/icomoon.svg'),
            'ttf_url'   => $this->assetUrl('fonts/icomoon.ttf'),
            'woff_url'  => $this->assetUrl('fonts/icomoon.woff')
        ]);

        return response($response)->withHeader('Content-type', 'text/css');
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
            'chart-font-color'               => '#212529', // FanChart
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

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleAuthorName()
     */
    public function customModuleAuthorName(): string
    {
        return 'Carmen Pijpers-Knegt';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleVersion()
     */
    public function customModuleVersion(): string
    {
        return '2.0.7-dev';
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
};
