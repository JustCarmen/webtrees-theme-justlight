<?php
/**
 * JustLight theme for webtrees (online genealogy)
 * Copyright (C) 2019 JustCarmen (http://www.justcarmen.nl)
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

use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\Individual;
use Fisharebest\Webtrees\Media;
use Fisharebest\Webtrees\Menu;
use Fisharebest\Webtrees\Module;
use Fisharebest\Webtrees\Theme\MinimalTheme;
use Fisharebest\Webtrees\Webtrees;
use JustCarmen\WebtreesAddOns\FancyImagebar\FancyImagebarClass;

class JustBaseTheme extends MinimalTheme {
	const THEME_VERSION = '2.0.0-dev';
	const DESIGNER_URL  = 'http://www.justcarmen.nl';

	/**
	 * Datatable markup
	 * Positioning the elements in the table
	 * @return string
	 */
	public function datatableMarkup() {
		return
			"<'row mt-3 mb-lg-1'<'col-md-12 col-lg-6'l><'col-md-12 col-lg-6 d-flex justify-content-lg-end'f>>" .
			"<'row'<'col-6 d-none d-lg-block'i><'col-6 d-none d-lg-block'p>>" .
			"<'row'<'col-sm-12'tr>>" .
			"<'row'<'col-md-12 col-lg-6'i><'col-md-12 col-lg-6'p>>";
	}

	/**
	 * Url to the homepage of the designer of this theme
	 * @return type
	 */
	public function designerUrl() {
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

	/**
	 * Add an identifier to the body class for styling purposes
	 * We need a seperate identifier for module and list pages
	 *
	 * @return string
	 */
	public function getThemeGlobalClass() {
		$class = ' jc-global-' . $this->request->get('route');

		$module = $this->request->get('module');
		if ($module) {
			$class .= '-' . $module;
		}

		if (strpos($this->request->get('route'), '-list') !== false && $this->request->get('route') !== 'media-list') {
			$class .= ' jc-global-list';
		}
		return $class;
	}

	/**
	 * {@inheritdoc}
	 * Display an individual in a box - for charts, etc.
	 *
	 * @param Individual $individual
	 * We need an extra div to use a flexbox layout
	 * Thumbnail restriction
	 *
	 * @return string
	 */
	public function individualBox(Individual $individual): string {
		$personBoxClass = array_search($individual->getSex(), ['person_box' => 'M', 'person_boxF' => 'F', 'person_boxNN' => 'U']);
		if ($individual->canShow() && $individual->tree()->getPreference('SHOW_HIGHLIGHT_IMAGES')) {
			// Only use images of the type 'photo' as thumbnail
			// Source: $individual_media from app\Http\Controllers\IndividualController.php
			$individual_media = [];
			foreach ($individual->facts(['OBJE']) as $fact) {
				$media_object = $fact->target();
				if ($media_object instanceof Media) {
					foreach ($media_object->mediaFiles() as $media_file) {
						if ($media_file->isImage() && $media_file->type() === 'photo') {
							$individual_media[] = $media_file;
						}
					}
				}
			}
			$individual_media = array_filter($individual_media);
			if (empty($individual_media)) {
				$thumbnail = '<i class="icon-silhouette-' . $individual->getSex() . '"></i>';
			} else {
				$thumbnail = $individual_media[0]->displayImage(40, 50, 'crop', []);
			}
		} else {
			$thumbnail = '';
		}

		$content = '<span class="namedef name1">' . $individual->getFullName() . '</span>';
		$icons   = '';
		if ($individual->canShow()) {
			$content = '<a href="' . $individual->url() . '">' . $content . '</a>' .
				'<div class="namedef name1">' . $individual->getAddName() . '</div>';
			$icons = '<div class="icons order-2">' .
				'<span class="iconz icon-zoomin" title="' . I18N::translate('Zoom in/out on this box.') . '"></span>' .
				'<div class="itr"><i class="icon-pedigree"></i><div class="popup">' .
				'<ul class="' . $personBoxClass . '">' . implode('', array_map(function (Menu $menu) {
					return $menu->bootstrap4();
				}, $this->individualBoxMenu($individual))) . '</ul>' .
				'</div>' .
				'</div>' .
				'</div>';
		}

		// specific compact layout for the pedigree chart. We prefer a compact layout with default oldest on top on the pedigree chart
		if ($this->request->get('route') === 'pedigree-chart' && ($this->request->get('orientation') === '2' || $this->request->get('orientation') === '3')) {
			return
				'<div data-pid="' . $individual->xref() . '" class="person_box_template ' . $personBoxClass . ' box-style1 d-flex justify-content-between" style="width: ' . $this->parameter('chart-box-x') . 'px; height: ' . $this->parameter('chart-box-y') . 'px">' .
				'<div class="chart_textbox d-flex width100 justify-content-center" style="max-height:' . $this->parameter('chart-box-y') . 'px;">' .
				'<div class="d-flex flex-column align-items-center text-center">' .
				$thumbnail . $content .
				'<div class="inout2 details1">' . $individual->getLifeSpan() . '</div>' .
				'</div>' .
				'</div>' .
				'<div class="inout"></div>' .
				'</div>';
		} else {
			return
				'<div data-pid="' . $individual->xref() . '" class="person_box_template ' . $personBoxClass . ' box-style1 d-flex justify-content-between" style="width: ' . $this->parameter('chart-box-x') . 'px; height: ' . $this->parameter('chart-box-y') . 'px">' .
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
	}

	/** {@inheritdoc} */
	public function logoPoweredBy(): string {
		return '<a href="' . e(Webtrees::URL) . '" class="wt-powered-by-webtrees" title="' . e(Webtrees::URL) . '" dir="ltr"></a>';
	}

	/**
	 * Misecellaneous dimensions, fonts, styles, etc.
	 *
	 * @param string $parameter_name
	 *
	 * @return string|int|float
	 */
	public function parameter($parameter_name) {
		$path       = static::ASSET_DIR . 'css/images/charts/';
		$parameters = [
		'image-dline'  => $path . 'dline.png',
		'image-dline2' => $path . 'dline2.png',
		'image-hline'  => $path . 'hline.png',
		'image-spacer' => $path . 'spacer.png',
		'image-vline'  => $path . 'vline.png'
	];

		if ($this->request->get('route') === 'pedigree-chart' && ($this->request->get('orientation') === '2' || $this->request->get('orientation') === '3')) {
			$parameters['chart-box-x'] = 105;
			$parameters['chart-box-y'] = 140;
		}

		if (array_key_exists($parameter_name, $parameters)) {
			return $parameters[$parameter_name];
		} else {
			return parent::parameter($parameter_name);
		}
	}
}
