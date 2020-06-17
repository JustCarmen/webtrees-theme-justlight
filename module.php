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

namespace JustCarmen\WebtreesModules\JustLightTheme;

use Fig\Http\Message\StatusCodeInterface;
use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\View;
use Fisharebest\Webtrees\Module\MinimalTheme;
use Fisharebest\Webtrees\Module\ModuleCustomInterface;
use Fisharebest\Webtrees\Module\ModuleCustomTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class JustLightTheme - Main class for JustLight Theme.
 */
class JustLightTheme extends MinimalTheme implements ModuleCustomInterface
{
    use ModuleCustomTrait;
    
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
        View($this->name() . '::script.js');
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
            $this->assetUrl('css/justlight.min.css')
        ];
    }

    
    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleThemeInterface::stylesheets()
     */
    public function parameter($parameter_name)
    {
        $parameters = [];

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
        return '2.0';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleSupportUrl()
     */
    public function customModuleSupportUrl(): string
    {
        return 'https://github.com/justcarmen/justlight';
    }

}

return new JustLightTheme();
